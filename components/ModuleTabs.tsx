'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export interface TabModule {
  slug: string;
  number: number;
  short: string;
}

/**
 * Pindah antar Bagian (modul) dari bilah atas.
 *
 * Berupa menu lipat (<details>) supaya bilah atas tetap satu baris berapa pun jumlah Bagian-nya;
 * deretan chip yang lebar tidak muat lagi begitu Bagian bertambah. Tanpa JavaScript, menu tetap
 * bisa dibuka dan ditutup; skrip di bawah hanya menambah penutupan otomatis (pindah halaman,
 * tombol Esc, klik atau fokus di luar menu).
 */
export function ModuleTabs({ modules }: { modules: TabModule[] }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDetailsElement>(null);
  const current = modules.find((m) => pathname === `/${m.slug}` || pathname.startsWith(`/${m.slug}/`));

  // tutup setelah berpindah halaman
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const close = () => {
      el.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && el.open) {
        close();
        el.querySelector('summary')?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (el.open && !el.contains(e.target as Node)) close();
    };
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (el.open && next && !el.contains(next)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    el.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return (
    <nav aria-label="Bagian materi" className="bagian-nav">
      <details className="bagian-menu" ref={ref}>
        <summary className="bagian-menu__button">
          <span className="bagian-menu__label">
            <span className="tab__no">{current ? `Bagian ${current.number}` : `${modules.length} Bagian`}</span>
            <span className="tab__name">{current ? current.short : 'Pilih Bagian'}</span>
          </span>
        </summary>
        <ul className="bagian-menu__list">
          {modules.map((m) => {
            const exact = pathname === `/${m.slug}`;
            const inside = exact || pathname.startsWith(`/${m.slug}/`);
            return (
              <li key={m.slug}>
                <Link
                  href={`/${m.slug}`}
                  className="tab"
                  aria-current={exact ? 'page' : inside ? 'true' : undefined}
                  onClick={() => {
                    // klik pada Bagian yang sedang dibuka tidak mengganti alamat, jadi tutup menu di sini juga
                    if (ref.current) ref.current.open = false;
                  }}
                >
                  <span className="tab__no">Bagian {m.number}</span>
                  <span className="tab__name">{m.short}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </details>
    </nav>
  );
}
