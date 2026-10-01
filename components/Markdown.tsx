import Link from 'next/link';
import { Children } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getLinkContext } from '@/lib/content';
import { remarkSlideLinks } from '@/lib/remark-slide-links';
import { MathBlock } from './MathBlock';
import { ScrollBox } from './ScrollBox';

const components: Components = {
  a({ node: _node, href, children, ...rest }) {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    const external = href !== undefined && /^https?:\/\//.test(href);
    return (
      <a href={href} {...rest} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
        {external ? <span className="sr-only"> (membuka tab baru)</span> : null}
      </a>
    );
  },
  table({ node: _node, children }) {
    return (
      <ScrollBox label="Tabel; geser ke samping untuk melihat seluruh kolom" className="table-scroll">
        <table>{children}</table>
      </ScrollBox>
    );
  },
  th({ node: _node, children, ...rest }) {
    // sel pojok kiri atas yang kosong pada tabel dua arah: bukan judul kolom yang sebenarnya
    if (Children.count(children) === 0) return <td className="corner" />;
    return <th {...rest}>{children}</th>;
  },
  pre({ node, children }) {
    const code = node?.children?.[0];
    if (code && code.type === 'element' && code.tagName === 'code') {
      const classes = code.properties?.className;
      if (Array.isArray(classes) && classes.includes('language-latex')) {
        const text = code.children[0];
        return <MathBlock latex={text && text.type === 'text' ? text.value : ''} />;
      }
    }
    return <pre>{children}</pre>;
  },
};

/**
 * Teks Markdown → HTML. "slide N" otomatis menjadi tautan; ```latex menjadi rumus; tabel bisa digeser.
 * `module` adalah slug modul yang sedang dibaca, `slide` nomor slide yang sedang dibuka (tidak ditautkan ke dirinya sendiri).
 */
export function Markdown({ source, module, slide = null }: { source: string; module: string; slide?: number | null }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, [remarkSlideLinks, getLinkContext(module, slide)]]} components={components}>
      {source}
    </ReactMarkdown>
  );
}
