import { notFound } from 'next/navigation';
import { SlideNav } from '@/components/SlideNav';
import { getModule, getModules, getSlideTitles } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return getModules().map((m) => ({ module: m.slug }));
}

export default async function ModuleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();
  const titles = getSlideTitles(slug);
  const chapters = mod.chapters.map((c) => ({
    title: c.title,
    slides: c.slides.map((n) => ({ n, title: titles.get(n) ?? `Slide ${n}` })),
  }));
  return (
    <div className="shell">
      <SlideNav module={{ slug: mod.slug, number: mod.number, title: mod.title, short: mod.short }} chapters={chapters} />
      <main id="isi" className="main" tabIndex={-1} data-drawer-inert="">
        {children}
      </main>
    </div>
  );
}
