import Link from 'next/link';
import { getModules } from '@/lib/content';
import { ModuleTabs } from './ModuleTabs';

export function SiteHeader() {
  const modules = getModules().map((m) => ({ slug: m.slug, number: m.number, short: m.short }));
  return (
    <header className="site-header" data-drawer-inert="">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">
            KA
          </span>
          <span className="brand__text">Catatan KA dan Sains Data</span>
        </Link>
        <ModuleTabs modules={modules} />
      </div>
    </header>
  );
}
