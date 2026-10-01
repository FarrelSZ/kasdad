import Link from 'next/link';
import { ContinueLink, ProgressBar } from '@/components/Progress';
import { Legend } from '@/components/Legend';
import { Markdown } from '@/components/Markdown';
import { getHome, getModules } from '@/lib/content';

export default function HomePage() {
  const modules = getModules();
  const home = getHome();
  return (
    <main id="isi" className="page home" tabIndex={-1} data-drawer-inert="">
      <p className="eyebrow">CSGE603130 · Fasilkom UI</p>
      <h1>Catatan Kecerdasan Artifisial dan Sains Data Dasar</h1>
      {home ? (
        <div className="home__intro">
          <Markdown source={home} module={modules[0]?.slug ?? ''} />
        </div>
      ) : null}

      <section aria-labelledby="bagian-h">
        <h2 id="bagian-h">Bagian yang tersedia</h2>
        <ul className="cards">
          {modules.map((m) => {
            const chapterCount = m.chapters.length;
            return (
              <li key={m.slug} className="card">
                <p className="eyebrow">Bagian {m.number}</p>
                <h3>
                  <Link href={`/${m.slug}`}>{m.title}</Link>
                </h3>
                {m.description ? <p>{m.description}</p> : null}
                <p className="card__meta">
                  {m.slideNumbers.length} slide, {chapterCount} bab{m.source ? ` · sumber: ${m.source}` : ''}
                </p>
                <ProgressBar slug={m.slug} slideNumbers={m.slideNumbers} name={m.title} />
                <div className="card__actions">
                  <ContinueLink slug={m.slug} slideNumbers={m.slideNumbers} />
                  <Link href={`/${m.slug}`} className="btn">
                    Pengantar dan daftar slide
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="warna-h">
        <h2 id="warna-h">Arti warna pada setiap slide</h2>
        <p>Setiap slide dijelaskan dengan susunan yang sama. Warna di sisi kiri menunjukkan jenis bagiannya.</p>
        <Legend />
      </section>

      <section aria-labelledby="pakai-h">
        <h2 id="pakai-h">Tips memakai situs ini</h2>
        <ul>
          <li>Baca berurutan. Tiap slide menyambung ke slide sebelumnya, dan tiap bagian memakai istilah yang sudah dijelaskan sebelumnya.</li>
          <li>Coba jawab contoh soal sebelum membuka pembahasan. Tombol “Ya, saya sudah paham” di akhir slide menyimpan kemajuan Anda di peramban ini saja.</li>
          <li>
            Tombol panah kiri dan kanan di papan ketik berpindah antar-slide. Di layar sempit, daftar slide ada di tombol “Daftar slide”.
          </li>
        </ul>
      </section>
    </main>
  );
}
