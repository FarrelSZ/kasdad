'use client';

import { setParaham, useParahamSet } from '@/lib/progress';

/** "Sudah paham?": menandai slide ini (disimpan di peramban) sebelum lanjut ke slide berikutnya. */
export function UnderstoodBar({ slug, n }: { slug: string; n: number }) {
  const done = useParahamSet(slug);
  const isDone = done.has(n);
  return (
    <section className="understood" aria-labelledby="paham-h">
      <h2 id="paham-h">Sudah paham?</h2>
      <p>Coba jawab contoh soal dulu. Bila bagian ini sudah jelas, tandai, lalu lanjut ke slide berikutnya.</p>
      <div className="understood__row">
        <button type="button" className="btn btn--primary" aria-pressed={isDone} onClick={() => setParaham(slug, n, !isDone)}>
          <span aria-hidden="true" className="check">
            {isDone ? '✓' : ''}
          </span>
          Ya, saya sudah paham
        </button>
        <p className="understood__status" role="status">
          {isDone ? 'Ditandai paham. Tersimpan di peramban ini saja.' : ''}
        </p>
      </div>
    </section>
  );
}
