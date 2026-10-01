/**
 * Plugin remark: mengubah rujukan seperti "slide 12", "Slide 31–32", "slide 3, 4, dan 10" atau
 * "Bagian 1, slide 38" menjadi tautan ke halaman slide yang dimaksud.
 *
 * Aturan:
 * - "slide N" tanpa awalan berarti slide pada modul yang sedang dibaca.
 * - "Bagian K, slide N" menunjuk modul ke-K. Seluruh awalan itu ikut menjadi teks tautan.
 * - Pada daftar ("slide 3, 4, dan 10", "slide 31–32"), tiap nomor ditautkan sendiri-sendiri.
 * - Nomor yang tidak ada (mis. slide 11 pada Bagian 1) dan rujukan ke slide yang sedang dibuka
 *   dibiarkan sebagai teks biasa.
 * - Tulisan seperti "slide 1 dari 10" (urutan dalam carousel) tidak ditautkan.
 */
import type { Link, PhrasingContent, Root, Text } from 'mdast';
import { visit } from 'unist-util-visit';
import type { LinkContext } from './content';

// grup: 1 = awalan "Bagian K, " | 2 = K | 3 = kata "slide" | 4 = nomor pertama | 5 = nomor berikutnya (daftar atau rentang)
const REF = /(?:(Bagian\s+(\d+)\s*,\s*))?\b([Ss]lides?)\s+(\d{1,3})((?:[–-]\d{1,3}|\s*,\s*(?:dan\s+)?\d{1,3}|\s+(?:dan|atau|serta)\s+\d{1,3})*)/dg;
const MORE = /([–-]|\s*,\s*(?:dan\s+)?|\s+(?:dan|atau|serta)\s+)(\d{1,3})/g;
const NOT_A_REF = /^\s+dari\s+\d/;

export const slideHref = (slug: string, n: number) => `/${slug}/slide/${n}`;

export function remarkSlideLinks(ctx: LinkContext) {
  const linkable = (slug: string | undefined, n: number): slug is string =>
    slug !== undefined && ctx.has(slug, n) && !(slug === ctx.currentModule && n === ctx.currentSlide);

  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === undefined) return;
      if (parent.type === 'link' || parent.type === 'linkReference') return;

      const value = node.value;
      const out: PhrasingContent[] = [];
      let cursor = 0;
      let touched = false;

      const plain = (from: number, to: number) => {
        if (to <= from) return;
        const piece = value.slice(from, to);
        const last = out[out.length - 1];
        if (last && last.type === 'text') last.value += piece;
        else out.push({ type: 'text', value: piece });
      };
      const link = (slug: string, n: number, text: string, aria: string): Link => ({
        type: 'link',
        url: `/${slug}/slide/${n}`,
        title: null,
        children: [{ type: 'text', value: text }],
        data: { hProperties: { 'aria-label': aria } },
      });

      for (const m of value.matchAll(REF)) {
        const at = m.index ?? 0;
        const [, firstEnd] = m.indices![4];
        if (NOT_A_REF.test(value.slice(at + m[0].length))) continue;

        const slug = m[2] ? ctx.slugByNumber[Number(m[2])] : ctx.currentModule;
        const bagian = m[2] ? `Bagian ${m[2]}, ` : '';

        // rujukan pertama, termasuk awalan "Bagian K, " dan kata "slide"
        plain(cursor, at);
        const first = Number(m[4]);
        if (linkable(slug, first)) {
          out.push(link(slug, first, value.slice(at, firstEnd), `${bagian}Slide ${first}`));
          touched = true;
        } else {
          plain(at, firstEnd);
        }
        cursor = firstEnd;

        // nomor berikutnya pada daftar atau rentang: tiap angka ditautkan sendiri
        const restStart = m.indices![5][0];
        for (const r of (m[5] ?? '').matchAll(MORE)) {
          const numStart = restStart + (r.index ?? 0) + r[1].length;
          const numEnd = numStart + r[2].length;
          const num = Number(r[2]);
          plain(cursor, numStart);
          if (linkable(slug, num)) {
            out.push(link(slug, num, r[2], `${bagian}Slide ${num}`));
            touched = true;
          } else {
            plain(numStart, numEnd);
          }
          cursor = numEnd;
        }
      }

      if (!touched) return;
      plain(cursor, value.length);
      parent.children.splice(index, 1, ...out);
      return index + out.length;
    });
  };
}
