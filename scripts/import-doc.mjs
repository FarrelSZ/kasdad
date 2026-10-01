#!/usr/bin/env node
/**
 * Memecah dokumen Markdown gabungan (ekspor Claude Docs) menjadi berkas konten situs.
 *
 *   npm run import -- path/ke/Penjelasan_Slide.md
 *
 * Bentuk dokumen yang dibaca:
 *
 *   # Bagian 2: Pengantar Sains Data           <- satu modul (nomor Bagian + judul)
 *   ## Cara membaca Bagian 2                    <- bab pertama tanpa slide = pengantar modul
 *   ## Motivasi di Balik Sains Data (Slide 4–9) <- bab; rentang di dalam kurung hanya pemeriksaan
 *   ### Slide 4 – Judul slide                   <- satu slide, sampai judul berikutnya
 *
 * Hasil:
 *   content/<slug>/intro.md            pengantar modul (tanpa judulnya)
 *   content/<slug>/slides/NN.md        satu berkas per slide
 *   content/manifest.json              daftar modul dan bab (dibuat ulang untuk modul yang ada di dokumen)
 *   content/modules.config.json        slug, nama pendek, sumber; modul baru ditambahkan otomatis
 *
 * Hanya modul yang ada di dokumen yang ditulis ulang; modul lain dibiarkan.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'content');
const configPath = join(contentDir, 'modules.config.json');
const manifestPath = join(contentDir, 'manifest.json');

const warnings = [];
const warn = (msg) => warnings.push(msg);
const fail = (msg) => {
  console.error(`\nGAGAL: ${msg}\n`);
  process.exit(1);
};

const input = process.argv[2];
if (!input || input === '-h' || input === '--help') {
  console.log('Pemakaian: npm run import -- <berkas-ekspor.md>');
  process.exit(input ? 0 : 1);
}
if (!existsSync(input)) fail(`Berkas tidak ditemukan: ${input}`);

const text = readFileSync(input, 'utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
const lines = text.split('\n');

// ---------------------------------------------------------------- baca struktur dokumen
/** @type {{number:number,title:string,intro:string[]|null,introTitle:string,chapters:any[]}[]} */
const modules = [];
let mod = null;
let chap = null;
let slide = null;
let fence = null; // penanda pagar kode yang sedang terbuka

lines.forEach((line, i) => {
  const at = `baris ${i + 1}`;
  const fenceMatch = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
  if (fence) {
    if (fenceMatch && fenceMatch[1][0] === fence[0] && fenceMatch[1].length >= fence.length) fence = null;
    if (slide) slide.lines.push(line);
    else if (chap) chap.lines.push(line);
    return;
  }
  if (fenceMatch) fence = fenceMatch[1];

  if (!fenceMatch) {
    let m = /^# Bagian (\d+)\s*[:：]\s*(.+?)\s*$/.exec(line);
    if (m) {
      mod = { number: Number(m[1]), title: m[2], chapters: [] };
      modules.push(mod);
      chap = null;
      slide = null;
      return;
    }
    if (/^# /.test(line)) {
      // judul dokumen (sebelum modul pertama) atau lampiran (sesudahnya): bukan isi modul
      if (mod) warn(`${at}: judul tingkat 1 "${line.slice(2)}" mengakhiri modul "${mod.title}"; isinya di bawahnya diabaikan.`);
      mod = null;
      chap = null;
      slide = null;
      return;
    }
    if (mod) {
      m = /^## (.+?)\s*$/.exec(line);
      if (m) {
        chap = { heading: m[1], lines: [], slides: [], at };
        mod.chapters.push(chap);
        slide = null;
        return;
      }
      m = /^### Slide (\d+)\s+[–—-]\s+(.+?)\s*$/.exec(line);
      if (m) {
        if (!chap) fail(`${at}: "${line}" muncul sebelum judul bab (##) di Bagian ${mod.number}.`);
        slide = { n: Number(m[1]), title: m[2], lines: [], at };
        chap.slides.push(slide);
        return;
      }
      if (/^###\s/.test(line)) {
        fail(`${at}: judul tingkat 3 harus berbentuk "### Slide N – Judul", ditemukan: ${line}`);
      }
    }
  }
  if (slide) slide.lines.push(line);
  else if (chap) chap.lines.push(line);
});

if (modules.length === 0) fail('Tidak ada baris "# Bagian N: Judul" di dokumen.');

const trimBlank = (arr) => {
  let a = 0;
  let b = arr.length;
  while (a < b && arr[a].trim() === '') a++;
  while (b > a && arr[b - 1].trim() === '') b--;
  return arr.slice(a, b);
};

// ---------------------------------------------------------------- konfigurasi modul
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};
let configChanged = false;

const seenNumbers = new Set();
const manifestModules = [];

for (const m of modules) {
  if (seenNumbers.has(m.number)) fail(`Bagian ${m.number} muncul dua kali di dokumen.`);
  seenNumbers.add(m.number);

  if (!config[m.number]) {
    config[m.number] = { slug: `bagian-${m.number}`, short: m.title, source: '', description: '' };
    configChanged = true;
    warn(
      `Bagian ${m.number} belum ada di content/modules.config.json; entri bawaan ditambahkan ` +
        `(slug "bagian-${m.number}"). Ubah slug, nama pendek, sumber, dan keterangannya di berkas itu, lalu jalankan impor lagi.`,
    );
  }
  const slug = config[m.number].slug;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) fail(`Slug "${slug}" untuk Bagian ${m.number} harus huruf kecil, angka, dan tanda hubung.`);
  for (const other of Object.entries(config)) {
    if (Number(other[0]) !== m.number && other[1].slug === slug) fail(`Slug "${slug}" dipakai Bagian ${m.number} dan Bagian ${other[0]}.`);
  }

  // bab pertama tanpa slide = pengantar; bab lain tanpa slide diabaikan
  let intro = null;
  let introTitle = '';
  const chapters = [];
  for (const c of m.chapters) {
    if (c.slides.length === 0) {
      if (intro === null && chapters.length === 0) {
        intro = trimBlank(c.lines).join('\n');
        introTitle = c.heading;
      } else {
        warn(`Bagian ${m.number}: bab "${c.heading}" tidak punya slide dan diabaikan.`);
      }
      continue;
    }
    const range = /^(.*?)\s*\(\s*[Ss]lides?\s+(\d+)\s*[–—-]\s*(\d+)\s*\)\s*$/.exec(c.heading);
    const title = range ? range[1] : c.heading;
    const nums = c.slides.map((s) => s.n);
    if (range && (Number(range[2]) !== Math.min(...nums) || Number(range[3]) !== Math.max(...nums))) {
      warn(`Bagian ${m.number}, bab "${title}": judul menyebut slide ${range[2]}–${range[3]}, isinya slide ${Math.min(...nums)}–${Math.max(...nums)}.`);
    }
    chapters.push({ title, slides: nums, raw: c });
  }

  // nomor slide harus unik dan menaik
  const all = chapters.flatMap((c) => c.slides);
  const dup = all.filter((n, i) => all.indexOf(n) !== i);
  if (dup.length) fail(`Bagian ${m.number}: nomor slide ganda: ${[...new Set(dup)].join(', ')}.`);
  all.forEach((n, i) => {
    if (i > 0 && n < all[i - 1]) warn(`Bagian ${m.number}: slide ${n} muncul setelah slide ${all[i - 1]} (urutan tidak menaik).`);
  });

  // ---------------------------------------------------------------- tulis berkas
  const modDir = join(contentDir, slug);
  const slidesDir = join(modDir, 'slides');
  mkdirSync(slidesDir, { recursive: true });
  for (const f of readdirSync(slidesDir)) if (/^\d+\.md$/.test(f)) rmSync(join(slidesDir, f));

  let count = 0;
  for (const c of chapters) {
    for (const s of c.raw.slides) {
      const body = trimBlank(s.lines).join('\n');
      const file = `${String(s.n).padStart(2, '0')}.md`;
      writeFileSync(join(slidesDir, file), `### Slide ${s.n} – ${s.title}\n\n${body}\n`);
      count++;
    }
  }
  const introFile = join(modDir, 'intro.md');
  if (intro) writeFileSync(introFile, `${intro}\n`);
  else if (existsSync(introFile)) rmSync(introFile);

  manifestModules.push({
    number: m.number,
    slug,
    title: m.title,
    introTitle: introTitle || `Cara membaca Bagian ${m.number}`,
    chapters: chapters.map(({ title, slides }) => ({ title, slides })),
  });
  const gaps = [];
  const sorted = [...all].sort((a, b) => a - b);
  for (let n = sorted[0]; n <= sorted[sorted.length - 1]; n++) if (!sorted.includes(n)) gaps.push(n);
  console.log(
    `Bagian ${m.number} (${slug}): ${count} slide, ${chapters.length} bab, nomor ${sorted[0]}–${sorted[sorted.length - 1]}` +
      (gaps.length ? `, tidak ada: ${gaps.join(', ')}` : '') +
      (intro ? ', pengantar ditulis' : ', tanpa pengantar'),
  );
}

if (configChanged) writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

// manifest: gabungkan dengan modul yang tidak ada di dokumen ini
const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')).modules ?? [] : [];
const merged = [...previous.filter((p) => !seenNumbers.has(p.number)), ...manifestModules].sort((a, b) => a.number - b.number);
// susunan JSON dibuat ringkas: daftar nomor slide ditulis dalam satu baris
const manifestText = JSON.stringify({ modules: merged }, null, 2).replace(/\[\s*(\d[\d,\s]*)\]/g, (_all, inner) =>
  `[${inner.replace(/\s+/g, ' ').trim()}]`,
);
writeFileSync(manifestPath, `${manifestText}\n`);

if (warnings.length) {
  console.log('\nPeringatan:');
  for (const w of warnings) console.log(`  - ${w}`);
}
console.log('\nSelesai. Jalankan "npm run build" untuk memeriksa format semua slide.');
