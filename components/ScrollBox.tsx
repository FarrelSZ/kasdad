'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Pembungkus yang bisa digeser ke samping (tabel dan rumus yang lebar).
 * Wilayah ini baru bisa difokus lewat papan ketik (dan diberi nama) saat isinya memang meluap,
 * supaya pengguna papan ketik dapat menggeser dengan tombol panah.
 */
export function ScrollBox({ children, label, className = '' }: { children: ReactNode; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // tanpa toleransi: alat uji aksesibilitas (axe) menganggap kotak yang meluap satu piksel pun
    // sebagai wilayah yang bisa digeser, jadi kotak seperti itu harus bisa difokus juga
    const check = () => setScrollable(el.scrollWidth > el.clientWidth);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    // huruf KaTeX dimuat belakangan dan dapat mengubah lebar rumus
    void document.fonts?.ready.then(check);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scrollbox ${className}`.trim()}
      data-scrollbox=""
      {...(scrollable ? { tabIndex: 0, role: 'group', 'aria-label': label } : {})}
    >
      {children}
    </div>
  );
}
