Bagian ini menjelaskan 81 slide “Data Collection, Data Understanding, and Statistics” (pengumpulan data, pemahaman data, dan statistika) secara berurutan, dengan asumsi Anda belum tahu apa-apa tentang materinya. Cara bacanya sama dengan Bagian 1 dan 2.

Setiap slide memakai pola yang sama:

- **Isi slide**: apa yang dikatakan slide, dalam bahasa sehari-hari.
- **Istilah penting**: arti setiap istilah teknis.
- **Gambar dan diagram**: dijelaskan bagian demi bagian, bila ada.
- **Rumus**: asal-usul dan cara memakainya langkah demi langkah, bila ada. Bila slide tidak menuliskan rumus tetapi rumus membantu memahaminya, saya menambahkannya dan menandainya “tambahan dari saya”.
- **Analogi**, **Mengapa penting**, dan **Kaitan dengan slide sebelumnya**.
- **Contoh soal**: 2–4 soal latihan beserta pembahasannya. Coba jawab dulu sebelum membuka pembahasan.

Materi yang saya tambahkan di luar slide diberi tanda “contoh tambahan”, “tambahan dari saya”, atau “tambahan dari sumber luar”, dan yang berasal dari halaman web yang saya buka disertai tautan. Angka yang saya ukur sendiri dari gambar (misalnya luas irisan, panjang batang, atau jumlah persegi) disebut “hasil ukur saya”: itu bukan data dari slide dan ketelitiannya terbatas. Rujukan ke Bagian lain ditulis lengkap, misalnya “Bagian 2, slide 23”; tulisan “slide 15” saja berarti slide di Bagian 3.

**Peta alur kuliah**

1. Bagian awal (slide 1–5): sampul, penyusun, siklus CRISP-DM dengan tahap yang diperdalam di sini (slide 3), empat langkah persiapan proyek (slide 4), dan outline (slide 5).
2. Pengumpulan data (slide 6–15): data primer dan sekunder, data terbuka dan situs sumbernya, data media sosial, format berkas (CSV, TSV, XML, JSON), dan tujuh tantangan pengumpulan data.
3. Pemahaman data dan EDA (slide 16–19): analisis data eksploratif (*exploratory data analysis*): pengertian, asal istilah, alasan, dan pendekatannya.
4. Statistika deskriptif (slide 20–41): jenis data dan tingkat pengukuran (slide 21), ukuran pemusatan (rerata, median, modus; slide 22–26), ukuran sebaran (rentang, kuartil, pencilan, varians, simpangan baku; slide 27–34), bentuk sebaran (kemencengan dan keruncingan; slide 35–38), korelasi Pearson (slide 39–40), dan catatan bagi pemrogram tentang angka di komputer (slide 41).
5. Visualisasi data (slide 42–81): contoh dan alasan (slide 42–44), lima alat dasar (slide 45–57), lima alat khusus (slide 58–70), tiga alat lanjutan (slide 71–76), lalu prinsip desain dan contoh perbaikan (slide 77–81).

**Peta grafik: pertanyaan dan alatnya**

| Pertanyaan yang ingin dijawab | Alat | Slide |
| --- | --- | --- |
| Bagaimana nilai berubah dari waktu ke waktu? | diagram garis, diagram area | 46–47, 48 |
| Seperti apa sebaran satu variabel angka? | histogram, diagram kepadatan, diagram kotak | 49–52, 53, 64 |
| Bagaimana membandingkan nilai antarkategori? | diagram batang | 54–57 |
| Berapa bagian tiap kategori dari keseluruhan? | diagram lingkaran, peta pohon, diagram wafel | 59–63, 68–70, 72 dan 74 |
| Bagaimana hubungan dua variabel angka? | diagram pencar | 65–66 |
| Bagaimana pola pada tabel dua arah, misalnya kota × bulan? | peta panas | 67 |
| Kata apa yang paling sering muncul? | awan kata | 73 |
| Bagaimana hubungan tiga variabel angka sekaligus? | diagram gelembung | 75–76 |
| Bagaimana membuat grafik yang jujur dan bersih? | prinsip “less is more” dan contoh pie melawan batang | 77–81 |

**Catatan tentang file slide ini**

1. Nomor slide lengkap, 1 sampai 81. Sampul (slide 1) tidak menampilkan nomor. Slide 45 dan 58 tampak sebagai gambar sisipan: tanpa baris judul, dan slide 58 juga tanpa logo.
2. Slide 5, 6, 16, 20, dan 42 adalah slide “Outline”: slide 5 memuat seluruh outline, sedangkan keempat lainnya menyorot satu bab dan berfungsi sebagai penanda pergantian bab. Slide 71 adalah pembatas yang membuka kelompok alat visualisasi lanjutan.
3. Teks slide bercampur bahasa Indonesia dan Inggris, dan judul slide umumnya berbahasa Inggris. Pada heading saya memakai judul asli slide. Slide tanpa judul (slide 10 sampai 12 dan 71) saya beri keterangan Indonesia, dan slide berjudul sama saya bedakan dengan keterangan dalam kurung (misalnya slide 27 sampai 31 semuanya berjudul “Measure of Variation”). Dua pasang slide memuat gambar yang sama: slide 72 dan 74 (diagram wafel), serta slide 80 dan 81 (diagram lingkaran Google Apps).
4. Ada beberapa salah tulis di file sumber. Saya sebut di slide terkait dan tidak memperbaikinya diam-diam: “kuisioner” (slide 7; bakunya “kuesioner”), “mechanisms.This” tanpa spasi (slide 8), “Minesota” (slide 9), “Median (Q3)” (slide 33; median adalah Q2), “Platykurti” (slide 37), “leptopkurtic” (slide 38), “loosing” (slide 51; seharusnya “losing”), “each numbers” (slide 59), “Coy Carp” (slide 70; ikan koi), “world cloud” (slide 73), “1963-1.1-04” (slide 76), “more impactive” (slide 77; kata ini tampaknya berasal dari sumber aslinya), “Doments” (slide 80), serta kalimat slide 78 yang tampaknya kehilangan kata “not”. Judul slide 63 adalah “Pie Chart” padahal gambarnya diagram titik (*dot plot*).
5. Ada kejanggalan isi: slide 8 menyebut enam prinsip data terbuka, sedangkan sumbernya memuat tujuh; slide 11 menampilkan label PREMIUM padahal dicantumkan sebagai sumber data terbuka; contoh XML pada slide 14 bertahun 2019 sedangkan kreditnya 2020; slide 28 menghitung rentang sebagai selisih ditambah satu satuan, sedangkan kunci jawaban slide 31 memakai selisih biasa (6); slide 39 membahas korelasi Pearson tanpa menuliskan rumusnya; angka pada label diagram donat di galeri slide 44 berjumlah lebih dari 100%; label pada slide 62 berjumlah 83,90%; dan diagram lingkaran slide 80 memuat persentase yang berjumlah 190%.
6. Ada kejanggalan tampilan: tulisan kecil “Statprob - Descriptive Stats” di dasar slide 23, 25, 26, dan 41; label “Sample Mean” pada slide 23 menempel di samping rumus populasi; judul kolom tabel slide 24 saling menimpa; slide 29 memuat kotak tempelan berhuruf lain; teks slide 59 terpotong gambar dan teks slide 72 terpotong di tepi kanan; gambar slide 60 terpotong di bawah; alamat sumber slide 65 terpotong; pada slide 66 gambar diagram lingkaran tempelan menutupi dua panel; slide 69 memuat irisan kecil tanpa label; dan gambar slide 75 tampak diregangkan ke samping sekitar 1,1 kali.
7. Banyak gambar tidak mencantumkan sumber (misalnya slide 35, 40, 54, dan 57), dan satu alamat dipakai untuk dua gambar (slide 56). Tautan pada slide umumnya tidak saya buka; bila saya membuka halaman tertentu, hal itu saya nyatakan pada slide terkait.
