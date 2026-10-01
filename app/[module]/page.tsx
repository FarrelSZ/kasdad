import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContinueLink, ProgressBar } from '@/components/Progress';
import { Markdown } from '@/components/Markdown';
import { getIntro, getModule, getModules, getSlideTitles } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return getModules().map((m) => ({ module: m.slug }));
}

type Props = { params: Promise<{ module: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) return {};
  return { title: `Bagian ${mod.number}: ${mod.title}`, description: mod.description || undefined };
}

export default async function ModulePage({ params }: Props) {
  const { module: slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();
  const titles = getSlideTitles(slug);
  const intro = getIntro(slug);
  const range =
    mod.slideNumbers.length > 0 ? `slide ${mod.slideNumbers[0]}–${mod.slideNumbers[mod.slideNumbers.length - 1]}` : '';

  return (
    <div className="page">
      <p className="eyebrow">Bagian {mod.number}</p>
      <h1>{mod.title}</h1>
      <p className="meta">
        {mod.slideNumbers.length} slide ({range}){mod.source ? ` · sumber: ${mod.source}` : ''}
      </p>
      {mod.description ? <p className="lede">{mod.description}</p> : null}

      <div className="module-actions">
        <ContinueLink slug={mod.slug} slideNumbers={mod.slideNumbers} />
      </div>
      <ProgressBar slug={mod.slug} slideNumbers={mod.slideNumbers} name={mod.title} />

      {intro ? (
        <section className="intro" aria-labelledby="intro-h">
          <h2 id="intro-h">{mod.introTitle}</h2>
          <Markdown source={intro} module={mod.slug} />
        </section>
      ) : null}

      <section aria-labelledby="daftar-h">
        <h2 id="daftar-h">Daftar slide</h2>
        {mod.chapters.map((c) => (
          <div key={c.title} className="toc-chapter">
            <h3>
              {c.title}{' '}
              <span className="toc-chapter__range">
                (slide {c.slides[0]}–{c.slides[c.slides.length - 1]})
              </span>
            </h3>
            <ol className="toc-list">
              {c.slides.map((n) => (
                <li key={n}>
                  <Link href={`/${mod.slug}/slide/${n}`}>
                    <span className="toc-list__no">{n}</span>
                    <span>{titles.get(n)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ))}
        {mod.missing.length > 0 ? (
          <p className="meta">Slide {mod.missing.join(', ')} tidak ada di file sumber; nomor slide melompat, dan situs ini mengikuti nomor aslinya.</p>
        ) : null}
      </section>
    </div>
  );
}
