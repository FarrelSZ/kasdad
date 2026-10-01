'use client';

import Link from 'next/link';
import { useParahamSet } from '@/lib/progress';

/** Batang kemajuan: berapa slide pada satu modul yang sudah ditandai paham. */
export function ProgressBar({ slug, slideNumbers, name }: { slug: string; slideNumbers: number[]; name: string }) {
  const done = useParahamSet(slug);
  const total = slideNumbers.length;
  const count = slideNumbers.filter((n) => done.has(n)).length;
  const pct = total ? Math.round((100 * count) / total) : 0;
  return (
    <div className="progress">
      <div
        className="progress__bar"
        role="progressbar"
        aria-label={`Slide yang sudah ditandai paham, ${name}`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={count}
        aria-valuetext={`${count} dari ${total} slide`}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="progress__text">
        {count} dari {total} slide ditandai paham
      </p>
    </div>
  );
}

/** Tautan "Mulai" atau "Lanjut" ke slide pertama yang belum ditandai paham. */
export function ContinueLink({ slug, slideNumbers }: { slug: string; slideNumbers: number[] }) {
  const done = useParahamSet(slug);
  const next = slideNumbers.find((n) => !done.has(n));
  const any = slideNumbers.some((n) => done.has(n));
  if (next === undefined) {
    return (
      <Link href={`/${slug}/slide/${slideNumbers[0]}`} className="btn">
        Semua slide sudah ditandai paham. Baca ulang dari awal
      </Link>
    );
  }
  return (
    <Link href={`/${slug}/slide/${next}`} className="btn btn--primary">
      {any ? `Lanjut ke slide ${next}` : `Mulai dari slide ${next}`}
    </Link>
  );
}
