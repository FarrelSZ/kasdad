'use client';

import { useEffect, useState } from 'react';

/**
 * Tombol "buka semua pembahasan" untuk kumpulan <details> di dalam elemen berid `targetId`.
 * Saat mencetak, semua pembahasan dibuka sementara supaya ikut tercetak.
 */
export function ToggleAll({ targetId }: { targetId: string }) {
  const [allOpen, setAllOpen] = useState(false);

  useEffect(() => {
    const root = document.getElementById(targetId);
    if (!root) return;
    const all = () => Array.from(root.querySelectorAll('details'));
    const sync = () => {
      const list = all();
      setAllOpen(list.length > 0 && list.every((d) => d.open));
    };
    let before: boolean[] | null = null;
    const onBeforePrint = () => {
      before = all().map((d) => d.open);
      all().forEach((d) => (d.open = true));
    };
    const onAfterPrint = () => {
      if (before) all().forEach((d, i) => (d.open = before![i] ?? false));
      before = null;
    };
    root.addEventListener('toggle', sync, true); // peristiwa "toggle" tidak menggelembung
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);
    sync();
    return () => {
      root.removeEventListener('toggle', sync, true);
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, [targetId]);

  const onClick = () => {
    const root = document.getElementById(targetId);
    root?.querySelectorAll('details').forEach((d) => (d.open = !allOpen));
  };

  return (
    <button type="button" className="btn btn--small" onClick={onClick}>
      {allOpen ? 'Tutup semua pembahasan' : 'Buka semua pembahasan'}
    </button>
  );
}
