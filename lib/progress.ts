/**
 * Tanda "sudah paham" per slide, disimpan di localStorage peramban (tidak dikirim ke mana pun).
 *
 * Bentuk simpanan (kunci "kasdad:paham:v2"): {"ka":[1,2,5],"sd":[3]}, yaitu slug modul → nomor slide.
 * Kunci lama versi 1 ("pengantar-ka:paham:v1", hanya Bagian 1) dipindahkan otomatis ke "ka".
 * Bila localStorage tidak bisa dipakai (mode pribadi, dll.), tanda hanya bertahan selama halaman terbuka.
 */
import { useMemo, useSyncExternalStore } from 'react';

const KEY = 'kasdad:paham:v2';
const OLD_KEY = 'pengantar-ka:paham:v1';

type Store = Readonly<Record<string, readonly number[]>>;

const EMPTY: Store = Object.freeze({});
const listeners = new Set<() => void>();
let memoryRaw: string | null = null;
let lastRaw: string | null | undefined;
let lastStore: Store = EMPTY;

function sanitize(value: unknown): Store {
  const out: Record<string, number[]> = {};
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [slug, list] of Object.entries(value)) {
      if (!Array.isArray(list)) continue;
      const nums = list.filter((n): n is number => Number.isInteger(n) && n > 0 && n < 10000);
      if (nums.length) out[slug] = [...new Set(nums)].sort((a, b) => a - b);
    }
  }
  return out;
}

function parseOld(raw: string): number[] {
  try {
    const v: unknown = JSON.parse(raw);
    if (Array.isArray(v)) return v.map(Number).filter((n) => Number.isInteger(n) && n > 0);
    if (v && typeof v === 'object') {
      return Object.entries(v)
        .filter(([, on]) => Boolean(on))
        .map(([k]) => Number(k))
        .filter((n) => Number.isInteger(n) && n > 0);
    }
  } catch {
    /* bukan JSON: coba daftar yang dipisah koma */
  }
  return raw
    .split(/[,\s]+/)
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);
}

function readRaw(): string | null {
  if (memoryRaw !== null) return memoryRaw;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw !== null) return raw;
    const old = window.localStorage.getItem(OLD_KEY);
    if (old !== null) {
      const migrated = JSON.stringify({ ka: parseOld(old) });
      window.localStorage.setItem(KEY, migrated);
      return migrated;
    }
  } catch {
    /* localStorage tidak tersedia */
  }
  return null;
}

function snapshot(): Store {
  const raw = readRaw();
  if (raw === lastRaw) return lastStore;
  lastRaw = raw;
  try {
    lastStore = raw ? sanitize(JSON.parse(raw)) : EMPTY;
  } catch {
    lastStore = EMPTY;
  }
  return lastStore;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

/** Himpunan nomor slide yang sudah ditandai paham pada satu modul. */
export function useParahamSet(slug: string): ReadonlySet<number> {
  const store = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  return useMemo(() => new Set(store[slug] ?? []), [store, slug]);
}

export function setParaham(slug: string, n: number, value: boolean): void {
  const current = snapshot();
  const set = new Set(current[slug] ?? []);
  if (value) set.add(n);
  else set.delete(n);
  const next: Record<string, readonly number[]> = { ...current, [slug]: [...set].sort((a, b) => a - b) };
  if (next[slug].length === 0) delete next[slug];
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    memoryRaw = raw;
  }
  listeners.forEach((l) => l());
}
