import type { Section } from '@/lib/content';
import { Markdown } from './Markdown';
import { Quiz } from './Quiz';

const BADGE: Partial<Record<Section['kind'], string>> = {
  tambahan: 'bukan dari slide',
  luar: 'sumber luar',
};

/** Satu bagian slide (Analogi, Istilah penting, Contoh soal, dan seterusnya) dengan warna sesuai jenisnya. */
export function SectionView({ section, index, module, slide }: { section: Section; index: number; module: string; slide: number }) {
  const headingId = `sec-${index}-h`;
  const badge = BADGE[section.kind];
  return (
    <section className={`sec k-${section.kind}`} aria-labelledby={headingId}>
      <h2 id={headingId} className="sec__label">
        {section.label}
        {badge ? <span className="badge">{badge}</span> : null}
      </h2>
      {section.quiz ? (
        <Quiz quiz={section.quiz} id={`sec-${index}-quiz`} module={module} slide={slide} />
      ) : (
        <Markdown source={section.body} module={module} slide={slide} />
      )}
    </section>
  );
}
