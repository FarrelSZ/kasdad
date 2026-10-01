import Link from 'next/link';
import { getModules } from '@/lib/content';

export default function NotFound() {
  const modules = getModules();
  return (
    <main id="isi" className="page" tabIndex={-1}>
      <p className="eyebrow">Galat 404</p>
      <h1>Halaman tidak ditemukan</h1>
      <p>Alamat yang Anda buka tidak ada. Slide yang tersedia dapat dipilih dari daftar bagian berikut.</p>
      <ul>
        {modules.map((m) => (
          <li key={m.slug}>
            <Link href={`/${m.slug}`}>
              Bagian {m.number}: {m.title}
            </Link>
            {m.missing.length > 0
              ? ` (slide ${m.missing.join(', ')} tidak ada di file sumber; nomornya melompat)`
              : ''}
          </li>
        ))}
      </ul>
      <p>
        <Link href="/" className="btn btn--primary">
          Ke halaman depan
        </Link>
      </p>
    </main>
  );
}
