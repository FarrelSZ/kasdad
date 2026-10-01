/**
 * Pembaca konten: modul, bab, dan berkas slide.
 *
 * Struktur berkas (dibuat oleh `npm run import`, lihat scripts/import-doc.mjs):
 *   content/modules.config.json   slug, nama pendek, sumber, keterangan tiap modul (diedit tangan)
 *   content/manifest.json         daftar bab dan nomor slide (dibuat otomatis)
 *   content/<slug>/intro.md       pengantar modul
 *   content/<slug>/slides/NN.md   satu berkas per slide
 *
 * Semua pemeriksaan format dilakukan di sini, jadi `npm run build` berhenti dengan pesan yang
 * menyebut modul, nomor slide, dan letak kesalahannya bila ada berkas slide yang rusak.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import type { List, ListItem, Paragraph, Root, RootContent, Strong } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const CONTENT_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), 'content');

// ------------------------------------------------------------------ tipe

export type SectionKind = 'analogi' | 'istilah' | 'catatan' | 'mengapa' | 'kaitan' | 'soal' | 'luar' | 'tambahan' | 'blok';

export interface ChapterInfo {
  title: string;
  slides: number[];
}

export interface ModuleInfo {
  number: number;
  slug: string;
  title: string;
  short: string;
  source: string;
  description: string;
  introTitle: string;
  chapters: ChapterInfo[];
  /** semua nomor slide yang ada, menaik */
  slideNumbers: number[];
  /** nomor yang "bolong" di antara slide pertama dan terakhir (mis. 11 pada Bagian 1) */
  missing: number[];
}

export interface QuizItem {
  question: string;
  answer: string;
}

export interface QuizData {
  before: string;
  items: QuizItem[];
  after: string;
}

export interface Section {
  kind: SectionKind;
  label: string;
  body: string;
  quiz?: QuizData;
}

export interface Slide {
  module: string;
  n: number;
  title: string;
  lead: string;
  sections: Section[];
}

export interface SlideRef {
  module: string;
  moduleNumber: number;
  moduleShort: string;
  n: number;
  title: string;
}

// ------------------------------------------------------------------ pembacaan berkas dengan cache per waktu ubah

const cache = new Map<string, { mtime: number; value: unknown }>();

/** `kind` membedakan hasil olahan yang berbeda dari berkas yang sama. */
function memo<T>(kind: string, file: string, compute: (text: string) => T): T {
  const key = `${kind}:${file}`;
  const mtime = statSync(file).mtimeMs;
  const hit = cache.get(key);
  if (hit && hit.mtime === mtime) return hit.value as T;
  const value = compute(readFileSync(file, 'utf8'));
  cache.set(key, { mtime, value });
  return value;
}

const pad = (n: number) => String(n).padStart(2, '0');
const slideFile = (slug: string, n: number) => path.join(CONTENT_DIR, slug, 'slides', `${pad(n)}.md`);

// ------------------------------------------------------------------ modul

interface RawConfig {
  slug: string;
  short?: string;
  source?: string;
  description?: string;
}
interface RawModule {
  number: number;
  slug: string;
  title: string;
  introTitle?: string;
  chapters: ChapterInfo[];
}

let modulesCache: { key: string; value: ModuleInfo[] } | null = null;

export function getModules(): ModuleInfo[] {
  const configFile = path.join(CONTENT_DIR, 'modules.config.json');
  const manifestFile = path.join(CONTENT_DIR, 'manifest.json');
  if (!existsSync(manifestFile)) {
    throw new Error('content/manifest.json tidak ada. Jalankan "npm run import -- <berkas-ekspor.md>" terlebih dahulu.');
  }
  const key = `${statSync(configFile).mtimeMs}:${statSync(manifestFile).mtimeMs}`;
  if (modulesCache && modulesCache.key === key) return modulesCache.value;

  const config = JSON.parse(readFileSync(configFile, 'utf8')) as Record<string, RawConfig>;
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8')) as { modules: RawModule[] };

  const result = manifest.modules
    .map((m): ModuleInfo => {
      const c = config[String(m.number)];
      if (!c) throw new Error(`Bagian ${m.number} ada di manifest.json tetapi belum ada di content/modules.config.json.`);
      if (c.slug !== m.slug) {
        throw new Error(`Slug Bagian ${m.number} berbeda: modules.config.json "${c.slug}", manifest.json "${m.slug}". Jalankan impor lagi.`);
      }
      const slideNumbers = m.chapters.flatMap((ch) => ch.slides).sort((a, b) => a - b);
      const missing: number[] = [];
      for (let n = slideNumbers[0]; n <= slideNumbers[slideNumbers.length - 1]; n++) if (!slideNumbers.includes(n)) missing.push(n);
      for (const n of slideNumbers) {
        if (!existsSync(slideFile(m.slug, n))) throw new Error(`Berkas slide tidak ada: content/${m.slug}/slides/${pad(n)}.md`);
      }
      return {
        number: m.number,
        slug: m.slug,
        title: m.title,
        short: c.short || m.title,
        source: c.source ?? '',
        description: c.description ?? '',
        introTitle: m.introTitle || `Cara membaca Bagian ${m.number}`,
        chapters: m.chapters,
        slideNumbers,
        missing,
      };
    })
    .sort((a, b) => a.number - b.number);

  modulesCache = { key, value: result };
  return result;
}

export function getModule(slug: string): ModuleInfo | undefined {
  return getModules().find((m) => m.slug === slug);
}

export function getIntro(slug: string): string | null {
  const file = path.join(CONTENT_DIR, slug, 'intro.md');
  return existsSync(file) ? memo('text', file, (t) => t.trim()) : null;
}

export function getHome(): string {
  const file = path.join(CONTENT_DIR, 'home.md');
  return existsSync(file) ? memo('text', file, (t) => t.trim()) : '';
}

// ------------------------------------------------------------------ judul slide dan tetangga

const HEADING = /^### Slide (\d+)\s+[–-]\s+(.+?)\s*$/;

/** Judul semua slide pada satu modul (dibaca dari baris pertama tiap berkas). */
export function getSlideTitles(slug: string): Map<number, string> {
  const mod = getModule(slug);
  if (!mod) throw new Error(`Modul tidak dikenal: ${slug}`);
  const titles = new Map<number, string>();
  for (const n of mod.slideNumbers) {
    const first = memo('title', slideFile(slug, n), (t) => t.split('\n', 1)[0]);
    const m = HEADING.exec(first);
    if (!m || Number(m[1]) !== n) {
      throw new Error(`content/${slug}/slides/${pad(n)}.md: baris pertama harus "### Slide ${n} – Judul", ditemukan: ${first}`);
    }
    titles.set(n, m[2]);
  }
  return titles;
}

/** Urutan baca seluruh slide lintas modul. */
export function getReadingOrder(): SlideRef[] {
  const out: SlideRef[] = [];
  for (const m of getModules()) {
    const titles = getSlideTitles(m.slug);
    for (const n of m.slideNumbers) {
      out.push({ module: m.slug, moduleNumber: m.number, moduleShort: m.short, n, title: titles.get(n) ?? '' });
    }
  }
  return out;
}

export function getNeighbors(slug: string, n: number): { prev: SlideRef | null; next: SlideRef | null } {
  const order = getReadingOrder();
  const i = order.findIndex((s) => s.module === slug && s.n === n);
  return { prev: i > 0 ? order[i - 1] : null, next: i >= 0 && i < order.length - 1 ? order[i + 1] : null };
}

export function chapterOf(mod: ModuleInfo, n: number): ChapterInfo | undefined {
  return mod.chapters.find((c) => c.slides.includes(n));
}

// ------------------------------------------------------------------ konteks tautan "slide N"

export interface LinkContext {
  currentModule: string;
  currentSlide: number | null;
  /** nomor Bagian → slug */
  slugByNumber: Record<number, string>;
  has: (slug: string, n: number) => boolean;
}

export function getLinkContext(currentModule: string, currentSlide: number | null = null): LinkContext {
  const mods = getModules();
  const slugByNumber: Record<number, string> = {};
  const sets = new Map<string, Set<number>>();
  for (const m of mods) {
    slugByNumber[m.number] = m.slug;
    sets.set(m.slug, new Set(m.slideNumbers));
  }
  return { currentModule, currentSlide, slugByNumber, has: (slug, n) => sets.get(slug)?.has(n) ?? false };
}

// ------------------------------------------------------------------ penguraian satu slide

const parser = unified().use(remarkParse).use(remarkGfm);
const parseMd = (src: string): Root => parser.parse(src) as Root;

function textOf(node: { value?: string; children?: unknown[] }): string {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map((c) => textOf(c as { value?: string; children?: unknown[] })).join('');
}

export function kindOf(label: string): SectionKind {
  const l = label.toLowerCase();
  if (/^contoh soal/.test(l)) return 'soal';
  if (/sumber luar/.test(l)) return 'luar';
  if (/contoh tambahan/.test(l)) return 'tambahan';
  if (/^analogi/.test(l)) return 'analogi';
  if (/^istilah penting/.test(l)) return 'istilah';
  if (/^(catatan|jebakan|keterbatasan)/.test(l)) return 'catatan';
  if (/^mengapa penting/.test(l)) return 'mengapa';
  if (/^kaitan dengan/.test(l)) return 'kaitan';
  return 'blok';
}

const start = (n: { position?: { start: { offset?: number } } }) => n.position?.start.offset ?? 0;
const end = (n: { position?: { end: { offset?: number } } }) => n.position?.end.offset ?? 0;

/** Potong sumber di antara dua posisi dan buang indentasi tempat blok itu bersarang. */
function sliceBlock(src: string, from: number, to: number, column: number): string {
  const indent = Math.max(0, column - 1);
  const [first, ...rest] = src.slice(from, to).split('\n');
  const strip = new RegExp(`^ {0,${indent}}`);
  return [first, ...rest.map((l) => l.replace(strip, ''))].join('\n').trim();
}

function isLabel(node: RootContent): node is Paragraph {
  return node.type === 'paragraph' && node.children[0]?.type === 'strong';
}

function parseQuiz(body: string, where: string): QuizData {
  const tree = parseMd(body);
  const lists = tree.children.filter((n): n is List => n.type === 'list');
  if (lists.length !== 1 || lists[0].ordered !== true) {
    throw new Error(
      `${where}: bagian "Contoh soal" harus berisi tepat satu daftar bernomor (1. 2. 3.), ditemukan ${lists.length} daftar. ` +
        'Pindahkan daftar lain ke bagian berlabel sendiri.',
    );
  }
  const list = lists[0];

  const items: QuizItem[] = list.children.map((item: ListItem, i: number) => {
    const at = `${where}, soal ${i + 1}`;
    const kids = item.children;
    const ansIdx = kids.findIndex(
      (k) =>
        k.type === 'list' &&
        k.children[0]?.children[0]?.type === 'paragraph' &&
        k.children[0].children[0].children[0]?.type === 'strong' &&
        /^pembahasan/i.test(textOf(k.children[0].children[0].children[0]).trim()),
    );
    if (ansIdx < 0) throw new Error(`${at}: tidak ada butir bersarang yang diawali "**Pembahasan:**".`);
    if (ansIdx !== kids.length - 1) throw new Error(`${at}: ada isi setelah butir "Pembahasan"; pembahasan harus butir terakhir pada soal.`);
    const ansList = kids[ansIdx] as List;
    if (ansList.children.length !== 1) throw new Error(`${at}: daftar pembahasan harus berisi satu butir.`);
    if (ansIdx === 0) throw new Error(`${at}: teks soal kosong (hanya ada pembahasan).`);

    const ansItem = ansList.children[0];
    const ansPara = ansItem.children[0] as Paragraph;
    const label = ansPara.children[0] as Strong;
    const first = kids[0];
    return {
      question: sliceBlock(body, start(first), start(ansList), first.position?.start.column ?? 1),
      answer: sliceBlock(body, end(label), end(ansItem), ansPara.position?.start.column ?? 1),
    };
  });
  if (items.length === 0) throw new Error(`${where}: daftar "Contoh soal" kosong.`);

  return { before: body.slice(0, start(list)).trim(), items, after: body.slice(end(list)).trim() };
}

function* walk(node: { children?: unknown[] }): Generator<{ type: string; lang?: string | null; value?: string }> {
  for (const c of node.children ?? []) {
    const child = c as { type: string; lang?: string | null; value?: string; children?: unknown[] };
    yield child;
    yield* walk(child);
  }
}

function parseSlide(slug: string, n: number, src: string): Slide {
  const where = `content/${slug}/slides/${pad(n)}.md`;
  const firstLine = src.split('\n', 1)[0];
  const h = HEADING.exec(firstLine);
  if (!h) throw new Error(`${where}: baris pertama harus "### Slide ${n} – Judul", ditemukan: ${firstLine}`);
  if (Number(h[1]) !== n) throw new Error(`${where}: judul menyebut slide ${h[1]}, tetapi nama berkas slide ${n}.`);

  const tree = parseMd(src);
  const heading = tree.children[0];
  if (!heading || heading.type !== 'heading' || heading.depth !== 3) throw new Error(`${where}: baris pertama bukan judul tingkat 3 (###).`);
  const nodes = tree.children.slice(1);

  // rumus LaTeX harus valid
  for (const c of walk(tree)) {
    if (c.type === 'code' && c.lang === 'latex') {
      try {
        katex.renderToString(c.value ?? '', { displayMode: true, throwOnError: true });
      } catch (e) {
        throw new Error(`${where}: rumus LaTeX tidak valid: ${(e as Error).message}`);
      }
    }
  }

  // paragraf tingkat atas yang diawali teks tebal = label bagian baru
  const labelIdx = nodes.map((node, i) => (isLabel(node) ? i : -1)).filter((i) => i >= 0);
  const leadEnd = labelIdx.length ? start(nodes[labelIdx[0]]) : src.length;
  const lead = src.slice(end(heading), leadEnd).trim();

  const sections: Section[] = labelIdx.map((idx, k) => {
    const para = nodes[idx] as Paragraph;
    const strong = para.children[0] as Strong;
    const label = textOf(strong).trim().replace(/[.:]\s*$/, '');
    if (label === '') throw new Error(`${where}: label tebal kosong di baris ${para.position?.start.line}.`);
    const sectionEnd = k + 1 < labelIdx.length ? start(nodes[labelIdx[k + 1]]) : src.length;
    // isi bagian: sisa paragraf label (bila label sebaris dengan teks) lalu blok-blok berikutnya
    const bodyStart = para.children.length > 1 ? start(para.children[1]) : (nodes[idx + 1] ? start(nodes[idx + 1]) : sectionEnd);
    const body = src.slice(Math.min(bodyStart, sectionEnd), sectionEnd).trim();
    const kind = kindOf(label);
    const section: Section = { kind, label, body };
    if (kind === 'soal') section.quiz = parseQuiz(body, `${where}, "${label}"`);
    return section;
  });

  if (!sections.some((s) => s.kind === 'soal')) {
    throw new Error(`${where}: tidak ada bagian "Contoh soal". Setiap slide wajib punya contoh soal beserta pembahasan.`);
  }
  if (sections.filter((s) => s.kind === 'soal').length > 1) throw new Error(`${where}: bagian "Contoh soal" muncul lebih dari sekali.`);

  return { module: slug, n, title: h[2], lead, sections };
}

export function getSlide(slug: string, n: number): Slide | null {
  const mod = getModule(slug);
  if (!mod || !mod.slideNumbers.includes(n)) return null;
  return memo('slide', slideFile(slug, n), (text) => parseSlide(slug, n, text));
}
