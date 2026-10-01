import katex from 'katex';
import { ScrollBox } from './ScrollBox';

/** Rumus LaTeX (blok ```latex) dirender KaTeX di server; di peramban tidak ada skrip rumus. */
export function MathBlock({ latex }: { latex: string }) {
  const html = katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false, strict: 'ignore' });
  return (
    <ScrollBox label="Rumus; geser ke samping untuk melihat seluruhnya" className="math-scroll">
      <div className="math-block" dangerouslySetInnerHTML={{ __html: html }} />
    </ScrollBox>
  );
}
