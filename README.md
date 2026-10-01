# Catatan Kecerdasan Artifisial dan Sains Data Dasar

Situs Next.js (React) yang menjelaskan slide kuliah **CSGE603130 Kecerdasan Artifisial dan Sains Data Dasar** (Fasilkom UI),
satu slide demi satu slide, dari nol. Tiap slide berisi analogi, arti istilah, penjelasan gambar dan rumus, kaitan dengan
slide sebelumnya, serta contoh soal dengan pembahasan yang terbuka bila diklik.

Situs ini menampung beberapa file slide sebagai **Bagian** yang terpisah, dan dirancang supaya file slide berikutnya
tinggal ditambahkan (lihat [Menambah file slide berikutnya](#menambah-file-slide-berikutnya)).

| Bagian | Isi | Alamat | Slide |
| --- | --- | --- | --- |
| 1 | Pengantar Kecerdasan Artifisial (`01 What is AI_updated.pdf`) | `/ka` | 52 slide, bernomor 1–53 tanpa 11 |
| 2 | Pengantar Sains Data (`02 What is Data Science_updated.pdf`) | `/sd` | 50 slide, bernomor 1–50 |
| 3 | Pengumpulan Data, Pemahaman Data (EDA), dan Statistika (`03_Data_Collection_EDA_and_Statistics_updated.pdf`) | `/data` | 81 slide, bernomor 1–81 |

Semua halaman dibuat statis saat `build`, jadi cepat dan cocok untuk Vercel. Tidak ada server, basis data, atau
variabel lingkungan yang perlu diatur.

## Fitur

- Halaman depan berisi daftar Bagian, kemajuan belajar, dan arti warna. Tiap Bagian punya halaman pengantar dan daftar
  slide per bab; tiap slide punya halamannya sendiri (`/ka/slide/19`, `/sd/slide/5`, dan seterusnya).
- Pindah antar-Bagian dari bilah atas. Tombol "Berikutnya" di slide terakhir sebuah Bagian melanjutkan ke slide pertama
  Bagian berikutnya.
- Responsif: panel daftar slide di layar lebar, laci geser di layar sempit; tabel dan rumus yang lebar bisa digeser.
- Mode gelap mengikuti pengaturan perangkat; tampilan cetak tersedia (pembahasan soal ikut tercetak).
- Rumus dirender dengan KaTeX di server, jadi tidak ada skrip rumus di peramban.
- Pencarian judul slide di panel samping.
- Tombol "Ya, saya sudah paham" per slide. Kemajuan disimpan di peramban (localStorage), tidak dikirim ke mana pun, dan
  terpisah untuk tiap Bagian.
- Papan ketik: panah kiri dan kanan berpindah slide; `Esc` menutup laci.
- Rujukan seperti "slide 12", "Slide 31–32", atau "Bagian 1, slide 38" otomatis menjadi tautan.
- Alamat lama versi 1 (`/slide/19`) dialihkan ke `/ka/slide/19`. Tanda "sudah paham" dari versi 1 dipindahkan otomatis
  ke Bagian 1.

## Yang dibutuhkan

- Node.js 20.9 atau lebih baru (diuji di Node 22) dan npm.

## Menjalankan di komputer

```bash
npm install
npm run dev          # http://localhost:3000, otomatis memuat ulang saat file diubah
```

Mencoba hasil produksi:

```bash
npm run build        # juga memeriksa tipe dan format semua file slide
npm start            # http://localhost:3000
```

## Deploy ke Vercel

### Cara 1: lewat GitHub (disarankan)

1. Buat repositori di GitHub, lalu unggah proyek ini:
   ```bash
   git init
   git add .
   git commit -m "Catatan KA dan Sains Data"
   git branch -M main
   git remote add origin https://github.com/NAMA-ANDA/NAMA-REPO.git
   git push -u origin main
   ```
2. Buka [vercel.com/new](https://vercel.com/new), pilih repositori tadi (**Import**).
3. Vercel mengenali proyek ini sebagai **Next.js**. Biarkan semua isian bawaan, lalu klik **Deploy**.
4. Setelah selesai, Vercel memberi alamat `https://nama-proyek.vercel.app`. Tiap `git push` berikutnya otomatis
   men-deploy ulang.

### Cara 2: lewat terminal (Vercel CLI)

```bash
npx vercel           # pertama kali: login dan jawab pertanyaan; hasilnya deploy pratinjau
npx vercel --prod    # deploy ke alamat produksi
```

### Kalau situs tidak ingin dibuka untuk umum

Isi situs memparafrasekan dan merangkum slide kuliah Fasilkom UI. Karena itu halaman-halamannya diberi tanda
`noindex` (tidak diminta masuk mesin pencari); tandanya ada di `app/layout.tsx`, pada `robots`. Tanda itu hanya meminta
mesin pencari tidak mendaftarkan situs, bukan membatasi siapa yang bisa membukanya. Bila alamatnya tidak boleh dibuka siapa
saja, atur **Settings, Deployment Protection** pada proyek Vercel Anda (pilihan yang tersedia tergantung paket Vercel).
Jangan memasang situs ini sebagai pengganti slide resmi; lihat juga bagian Catatan di bawah.

## Menambah file slide berikutnya

Sumber isi situs adalah satu dokumen Markdown gabungan (di Claude Docs: "Penjelasan Slide: Kecerdasan Artifisial dan
Sains Data Dasar"). Tiap file slide menjadi satu Bagian, dengan bentuk:

```markdown
# Bagian 4: Judul Bagian               <- nomor Bagian dan judulnya

## Cara membaca Bagian 4               <- bab pertama tanpa slide = pengantar Bagian

## Nama Bab (Slide 1–5)                <- bab; rentang di dalam kurung hanya untuk pemeriksaan

### Slide 1 – Judul Slide              <- satu slide, sampai judul berikutnya
```

Langkahnya:

1. Tambahkan Bagian baru ke dokumen gabungan (tugas penyusun catatan), lalu ekspor dokumen sebagai Markdown.
2. Pecah dokumen itu menjadi berkas konten:
   ```bash
   npm run import -- Penjelasan_Slide.md
   ```
   Skrip `scripts/import-doc.mjs` menulis `content/<slug>/slides/NN.md` dan `content/<slug>/intro.md`, lalu memperbarui
   `content/manifest.json`. Hanya Bagian yang ada di dokumen yang ditulis ulang.
3. Bila Bagian itu baru, skrip menambahkan entri bawaan ke `content/modules.config.json` (slug `bagian-4`). Ubah slug
   (huruf kecil, mis. `sd` atau `data`), nama pendek untuk bilah atas, nama file sumber, dan keterangan di berkas itu, lalu jalankan
   langkah 2 lagi. Slug menjadi alamat Bagian (`/slug/slide/N`).
4. Jalankan `npm run build`. Bila ada slide yang formatnya salah, build berhenti dengan pesan yang menyebut Bagian, nomor
   slide, dan letak kesalahannya.
5. `git add .`, `git commit`, `git push`. Vercel men-deploy ulang otomatis.

Catatan penting:

- Impor **menimpa** semua berkas slide pada Bagian yang ada di dokumen. Bila Anda mengubah berkas `content/<slug>/slides/NN.md`
  langsung, ubah juga dokumen sumbernya, atau jangan mengimpor Bagian itu lagi.
- Rujukan antar-Bagian ditulis lengkap, mis. "Bagian 1, slide 38". Tulisan "slide 15" tanpa awalan berarti slide pada
  Bagian yang sedang dibaca.
- Teks pengantar halaman depan ada di `content/home.md` (tidak disentuh impor).

## Mengedit isi

Seluruh isi ada di folder `content/`, berupa Markdown biasa. Tidak perlu menyentuh kode.

| File | Isi |
| --- | --- |
| `content/home.md` | Teks pengantar di halaman depan |
| `content/modules.config.json` | Slug, nama pendek, sumber, dan keterangan tiap Bagian (diedit tangan) |
| `content/manifest.json` | Daftar bab dan nomor slide tiap Bagian (dibuat otomatis oleh impor) |
| `content/<slug>/intro.md` | Pengantar sebuah Bagian ("Cara membaca Bagian N") |
| `content/<slug>/slides/NN.md` | Satu berkas per slide. `NN` memakai dua angka: `01.md`, `22.md`, `53.md` |

Setelah mengubah file, `npm run dev` langsung memperlihatkan hasilnya. Sebelum deploy, jalankan `npm run build`.

### Format satu slide

```markdown
### Slide 19 – Agent Design: Percept, Sensor, Aktuator, dan Fungsi Agen

Paragraf pembuka: satu-dua kalimat tentang isi slide.

**Analogi.** Perumpamaan sehari-hari.

**Isi slide**

- Poin pertama.
- Poin kedua.

**Istilah penting**

- **Sensor**: penerima informasi.

**Rumus, langkah demi langkah**

```latex
f : \mathcal{P}^{*} \rightarrow \mathcal{A}
```

**Mengapa penting.** Alasannya.

**Kaitan dengan slide sebelumnya.** Slide 17 berkata ...; slide 19 ...

**Contoh soal**

1. Teks soal pertama.
    - **Pembahasan:** jawaban dan langkahnya.
2. Teks soal kedua.
    - **Pembahasan:** ...
```

Aturan yang dipakai pembaca file (`lib/content.ts`):

- Baris pertama wajib `### Slide N – Judul` dan nomornya harus sama dengan nama file.
- Setiap **paragraf tingkat atas yang diawali teks tebal** (`**Label**`) membuka bagian baru. Label boleh berdiri sendiri
  (`**Isi slide**`) atau sebaris dengan teksnya (`**Analogi.** teks ...`). Nama labelnya menentukan tampilan:

  | Label | Tampilan |
  | --- | --- |
  | `Analogi` | latar kuning dengan garis jingga |
  | `Istilah penting` | biru |
  | `Catatan...`, `Jebakan...`, `Keterbatasan...` | merah |
  | `Mengapa penting` | abu-abu gelap |
  | `Kaitan dengan slide sebelumnya` | garis putus-putus abu-abu |
  | `Contoh soal` | hijau; wajib ada di setiap slide |
  | `Contoh tambahan: ...` atau `... (contoh tambahan ...)` | ungu putus-putus, dengan lencana "bukan dari slide" |
  | label yang memuat `sumber luar` | ungu putus-putus, dengan lencana "sumber luar" |
  | label lain (`Diagram, bagian demi bagian`, dan sebagainya) | blok biasa bergaris abu-abu |

- Bagian `Contoh soal` harus berupa daftar bernomor. Di bawah tiap soal, tulis pembahasan sebagai satu butir bersarang
  yang diawali `**Pembahasan:**`, dan butir itu harus yang terakhir pada soal.
- Rujukan seperti `slide 12`, `Slide 31–32`, `slide 3, 4, dan 10`, atau `Bagian 1, slide 38` otomatis menjadi tautan.
  Nomor yang tidak ada (mis. slide 11 pada Bagian 1), rujukan ke slide yang sedang dibuka, dan tulisan seperti
  "slide 1 dari 10" dibiarkan sebagai teks biasa.
- Tabel memakai sintaks tabel Markdown biasa. Rumus ditulis LaTeX di dalam blok kode ` ```latex `; rumus yang tidak
  valid menghentikan build.

Hal yang sering membuat bagian tidak tampil seperti harapan:

- **Jangan memulai paragraf biasa dengan huruf tebal.** `**Penting:** ...` di tengah bagian akan dianggap label bagian
  baru. Taruh kata tebal di tengah kalimat, atau awali paragraf dengan kata biasa.
- Daftar dan tabel di dalam sebuah bagian aman; yang dibaca sebagai label hanyalah paragraf tingkat atas.

## Mengubah tampilan

Warna, huruf, dan lebar teks diatur lewat variabel di bagian atas `app/globals.css` (`--accent`, `--measure`, dan
seterusnya). Warna tiap jenis bagian slide ada pada kelas `.k-analogi`, `.k-istilah`, dan seterusnya. Bagian
`@media (prefers-color-scheme: dark)` berisi warna mode gelap. Huruf memakai huruf bawaan sistem, jadi tidak ada berkas
huruf yang perlu diunduh (selain huruf rumus KaTeX yang ikut dalam paket).

## Struktur proyek

```text
app/
  layout.tsx                    kerangka halaman: bilah atas, kaki, metadata, tautan lompat ke isi
  page.tsx                      halaman depan: daftar Bagian, arti warna, tips
  [module]/layout.tsx           kerangka satu Bagian: panel daftar slide dan isi
  [module]/page.tsx             halaman Bagian: pengantar, kemajuan, daftar slide per bab
  [module]/slide/[n]/page.tsx   halaman satu slide (dibuat statis untuk nomor yang ada)
  not-found.tsx                 halaman 404 (mis. /ka/slide/11)
  globals.css                   seluruh gaya, termasuk mode gelap dan cetak
  icon.svg                      ikon situs
components/
  Markdown.tsx, MathBlock.tsx, ScrollBox.tsx   Markdown ke HTML; rumus KaTeX; tabel dan rumus yang bisa digeser
  SectionView.tsx, Quiz.tsx, ToggleAll.tsx     satu bagian slide; contoh soal; tombol "buka semua pembahasan"
  SiteHeader.tsx, ModuleTabs.tsx, SiteFooter.tsx   bilah atas dengan pilihan Bagian; kaki halaman
  SlideNav.tsx                  panel samping dan laci di layar sempit, dengan pencarian
  Pager.tsx                     tautan sebelumnya/berikutnya dan tombol panah papan ketik
  UnderstoodBar.tsx, Progress.tsx, Legend.tsx   tombol "sudah paham"; kemajuan; arti warna
content/                        isi (lihat bagian "Mengedit isi")
lib/
  content.ts                    pembaca konten dan pemeriksa format (dijalankan saat build)
  remark-slide-links.ts         mengubah "slide N" menjadi tautan
  progress.ts                   penyimpanan tanda "sudah paham" di localStorage
scripts/
  import-doc.mjs                memecah dokumen gabungan menjadi berkas konten
```

## Catatan

- **Bagian 1 tidak punya slide 11.** File slide sumber melompat dari slide 10 ke slide 12, jadi situs ini mengikuti
  penomoran sumber dan melewati 11.
- **Gambar slide tidak disertakan.** Gambar dan diagram pada slide asli dijelaskan dengan kata-kata, bagian demi bagian.
- **Tambahan dari sumber luar** (mis. Bagian 1 slide 51 dan 52, beberapa slide di Bagian 2, dan beberapa slide di Bagian 3)
  diberi label dan tautan sendiri; bedakan dari isi slide. Bagian "contoh tambahan" adalah contoh buatan penyusun catatan,
  bukan isi slide.
- **Data pada Bagian 1 slide 8** berasal dari tahun 2021.
- **Bagian 3 memuat angka yang dibaca atau diukur dari gambar slide** (mis. luas irisan diagram lingkaran 3D, jari-jari
  gelembung, nilai pada sumbu logaritmik). Angka itu diberi tanda "perkiraan dari gambar" atau "hasil ukur saya", jadi
  anggap sebagai taksiran, bukan data resmi. Salah ketik pada slide sumber disebut apa adanya, tidak diperbaiki diam-diam.
- Ini catatan belajar tidak resmi. Penjelasannya dibuat dengan bantuan AI, jadi cocokkan dengan slide asli dan buku
  teks sebelum dipakai untuk ujian. Hak atas materi slide ada pada penyusunnya di Fasilkom UI.
