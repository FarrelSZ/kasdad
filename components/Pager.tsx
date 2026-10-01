'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface PagerLink {
  href: string;
  /** teks kecil di atas judul, mis. "Bagian 2" bila pindah modul */
  kicker: string;
  title: string;
}

/** Tautan slide sebelumnya/berikutnya. Tombol panah kiri/kanan di papan ketik melakukan hal yang sama. */
export function Pager({ prev, next }: { prev: PagerLink | null; next: PagerLink | null }) {
  const router = useRouter();

  useEffect(() => {
    if (prev) router.prefetch(prev.href);
    if (next) router.prefetch(next.href);
  }, [prev, next, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const el = e.target instanceof Element ? e.target : null;
      // jangan mencuri tombol panah dari kolom isian, wilayah yang bisa digeser, atau saat laci terbuka
      if (el?.closest('input, textarea, select, [contenteditable="true"], [data-scrollbox], [role="slider"]')) return;
      if (document.querySelector('[data-drawer-inert][inert]')) return;
      const target = e.key === 'ArrowLeft' ? prev : next;
      if (!target) return;
      e.preventDefault();
      router.push(target.href);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, router]);

  return (
    <nav className="pager" aria-label="Slide sebelumnya dan berikutnya">
      {prev ? (
        <Link href={prev.href} rel="prev" className="pager__link pager__link--prev">
          <span className="pager__kicker">← Sebelumnya · {prev.kicker}</span>
          <span className="pager__title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} rel="next" className="pager__link pager__link--next">
          <span className="pager__kicker">Berikutnya · {next.kicker} →</span>
          <span className="pager__title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
