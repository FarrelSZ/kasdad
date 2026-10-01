'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useParahamSet } from '@/lib/progress';

export interface NavChapter {
  title: string;
  slides: { n: number; title: string }[];
}

interface Props {
  module: { slug: string; number: number; title: string; short: string };
  chapters: NavChapter[];
}

const DESKTOP = '(min-width: 60rem)';

/**
 * Daftar slide satu modul: panel tetap di layar lebar, laci geser di layar sempit.
 * Ada kolom pencarian judul, tanda ✓ untuk slide yang sudah dipahami, dan penanda slide yang sedang dibuka.
 */
export function SlideNav({ module: mod, chapters }: Props) {
  const pathname = usePathname();
  const done = useParahamSet(mod.slug);
  const navId = useId();
  const searchId = useId();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // laci otomatis tertutup bila alamat berubah (pindah slide)
  const open = openPath === pathname;
  const close = () => setOpenPath(null);

  const currentN = useMemo(() => {
    const m = new RegExp(`^/${mod.slug}/slide/(\\d+)/?$`).exec(pathname);
    return m ? Number(m[1]) : null;
  }, [pathname, mod.slug]);

  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () =>
      chapters
        .map((c) => ({
          ...c,
          slides: c.slides.filter((s) => !q || s.title.toLowerCase().includes(q) || String(s.n) === q || `slide ${s.n}`.includes(q)),
        }))
        .filter((c) => c.slides.length > 0),
    [chapters, q],
  );
  const shownCount = shown.reduce((sum, c) => sum + c.slides.length, 0);

  // slide yang sedang dibuka digulirkan ke dalam pandangan di daftar
  useEffect(() => {
    const current = listRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    current?.scrollIntoView({ block: 'nearest' });
  }, [pathname, open]);

  // saat laci terbuka: isi halaman dikunci, Esc menutup, fokus berpindah ke laci
  useEffect(() => {
    if (!open) return;
    const locked = Array.from(document.querySelectorAll<HTMLElement>('[data-drawer-inert]'));
    locked.forEach((el) => el.setAttribute('inert', ''));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenPath(null);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      locked.forEach((el) => el.removeAttribute('inert'));
      toggleRef.current?.focus();
    };
  }, [open]);

  // bila jendela dilebarkan sampai panel tetap tampil, laci ditutup
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const onChange = () => {
      if (mq.matches) setOpenPath(null);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <nav className="module-bar" aria-label="Menu daftar slide" data-drawer-inert="">
        <button
          ref={toggleRef}
          type="button"
          className="btn btn--small"
          aria-expanded={open}
          aria-controls={navId}
          onClick={() => setOpenPath(pathname)}
        >
          <span aria-hidden="true">☰</span> Daftar slide
        </button>
        <span className="module-bar__title">
          Bagian {mod.number}
          {currentN !== null ? ` · Slide ${currentN}` : ''}
        </span>
      </nav>

      {open ? <div className="scrim" onClick={close} aria-hidden="true" /> : null}

      <aside id={navId} className="sidebar" data-open={open ? 'true' : 'false'}>
        <div className="sidebar__head">
          <div>
            <p className="eyebrow">Bagian {mod.number}</p>
            <p className="sidebar__title">
              <Link href={`/${mod.slug}`} aria-current={pathname === `/${mod.slug}` ? 'page' : undefined}>
                {mod.title}
              </Link>
            </p>
          </div>
          <button ref={closeRef} type="button" className="btn btn--small sidebar__close" onClick={close}>
            Tutup
          </button>
        </div>

        <div className="sidebar__search">
          <label htmlFor={searchId}>Cari slide</label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="judul atau nomor"
            autoComplete="off"
            spellCheck={false}
          />
          <p className="sr-only" role="status">
            {q ? `${shownCount} slide ditemukan` : ''}
          </p>
        </div>

        <nav aria-label={`Daftar slide, ${mod.short}`} ref={listRef}>
          {shown.length === 0 ? <p className="sidebar__empty">Tidak ada slide yang cocok.</p> : null}
          {shown.map((c) => (
            <div key={c.title} className="chapter">
              <h2 className="chapter__title">{c.title}</h2>
              <ol className="chapter__list">
                {c.slides.map((s) => {
                  const isCurrent = s.n === currentN;
                  const isDone = done.has(s.n);
                  return (
                    <li key={s.n}>
                      <Link href={`/${mod.slug}/slide/${s.n}`} className="slide-link" aria-current={isCurrent ? 'page' : undefined}>
                        <span className="slide-link__no">{s.n}</span>
                        <span className="slide-link__title">{s.title}</span>
                        {isDone ? (
                          <>
                            <span className="slide-link__done" aria-hidden="true">
                              ✓
                            </span>
                            <span className="sr-only">sudah paham</span>
                          </>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
