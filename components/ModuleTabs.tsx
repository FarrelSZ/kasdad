'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface TabModule {
  slug: string;
  number: number;
  short: string;
}

/** Pindah antar Bagian (modul) dari bilah atas. */
export function ModuleTabs({ modules }: { modules: TabModule[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Bagian materi" className="tabs-wrap">
      <ul className="tabs">
        {modules.map((m) => {
          const exact = pathname === `/${m.slug}`;
          const inside = exact || pathname.startsWith(`/${m.slug}/`);
          return (
            <li key={m.slug}>
              <Link href={`/${m.slug}`} className="tab" aria-current={exact ? 'page' : inside ? 'true' : undefined}>
                <span className="tab__no">Bagian {m.number}</span>
                <span className="tab__name">{m.short}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
