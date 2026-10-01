import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Pager, type PagerLink } from '@/components/Pager';
import { Markdown } from '@/components/Markdown';
import { SectionView } from '@/components/SectionView';
import { UnderstoodBar } from '@/components/UnderstoodBar';
import { chapterOf, getModule, getModules, getNeighbors, getSlide, type SlideRef } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return getModules().flatMap((m) => m.slideNumbers.map((n) => ({ module: m.slug, n: String(n) })));
}

type Props = { params: Promise<{ module: string; n: string }> };

function load(slug: string, nParam: string) {
  if (!/^\d+$/.test(nParam)) return null;
  const n = Number(nParam);
  const mod = getModule(slug);
  const slide = getSlide(slug, n);
  return mod && slide ? { mod, slide, n } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: slug, n } = await params;
  const found = load(slug, n);
  if (!found) return {};
  return { title: `Slide ${found.n}: ${found.slide.title} (Bagian ${found.mod.number})` };
}

export default async function SlidePage({ params }: Props) {
  const { module: slug, n: nParam } = await params;
  const found = load(slug, nParam);
  if (!found) notFound();
  const { mod, slide, n } = found;
  const chapter = chapterOf(mod, n);
  const { prev, next } = getNeighbors(slug, n);

  const toLink = (ref: SlideRef | null): PagerLink | null =>
    ref
      ? {
          href: `/${ref.module}/slide/${ref.n}`,
          kicker: ref.module === slug ? `Slide ${ref.n}` : `Bagian ${ref.moduleNumber}, slide ${ref.n}`,
          title: ref.title,
        }
      : null;

  return (
    <article className="slide">
      <header className="slide__head">
        <p className="eyebrow">
          <Link href={`/${mod.slug}`}>Bagian {mod.number}: {mod.short}</Link>
          {chapter ? <> · {chapter.title}</> : null}
        </p>
        <h1>
          <span className="slide__no">Slide {n}</span> <span className="slide__title">{slide.title}</span>
        </h1>
      </header>

      {slide.lead ? (
        <div className="lead">
          <Markdown source={slide.lead} module={slug} slide={n} />
        </div>
      ) : null}

      {slide.sections.map((section, i) => (
        <SectionView key={i} section={section} index={i} module={slug} slide={n} />
      ))}

      <UnderstoodBar slug={slug} n={n} />
      <Pager prev={toLink(prev)} next={toLink(next)} />
    </article>
  );
}
