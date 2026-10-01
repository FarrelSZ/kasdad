import type { Metadata, Viewport } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: {
    default: 'Catatan KA dan Sains Data Dasar',
    template: '%s · Catatan KA dan Sains Data',
  },
  description:
    'Penjelasan setiap slide kuliah CSGE603130 Kecerdasan Artifisial dan Sains Data Dasar (Fasilkom UI) dari nol: analogi, istilah, gambar dan rumus, serta contoh soal dengan pembahasan.',
  // Catatan pribadi yang merangkum slide kuliah: tidak diminta masuk mesin pencari.
  // Hapus baris ini bila situs memang ingin ditemukan lewat pencarian.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <a href="#isi" className="skip-link">
          Lewati ke isi
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
