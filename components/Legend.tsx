const ITEMS: { kind: string; name: string; text: string }[] = [
  { kind: 'analogi', name: 'Analogi', text: 'perumpamaan dari kehidupan sehari-hari' },
  { kind: 'istilah', name: 'Istilah penting', text: 'arti setiap istilah teknis' },
  { kind: 'blok', name: 'Isi slide, gambar, diagram, rumus', text: 'penjelasan isi slide bagian demi bagian' },
  { kind: 'catatan', name: 'Catatan, jebakan, keterbatasan', text: 'hal yang mudah keliru atau perlu hati-hati' },
  { kind: 'mengapa', name: 'Mengapa penting', text: 'alasan konsep ini dipelajari' },
  { kind: 'kaitan', name: 'Kaitan dengan slide sebelumnya', text: 'benang merah antar-slide' },
  { kind: 'soal', name: 'Contoh soal', text: 'latihan; pembahasan terbuka bila diklik' },
  { kind: 'tambahan', name: 'Contoh tambahan', text: 'ditambahkan penyusun catatan, bukan dari slide' },
  { kind: 'luar', name: 'Tambahan dari sumber luar', text: 'dari sumber lain, lengkap dengan tautan' },
];

/** Penanda warna jenis bagian pada halaman slide. */
export function Legend() {
  return (
    <ul className="legend">
      {ITEMS.map((item) => (
        <li key={item.kind} className={`legend__item k-${item.kind}`}>
          <strong>{item.name}</strong>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
