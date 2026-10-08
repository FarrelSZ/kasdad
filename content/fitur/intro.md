Bagian ini menjelaskan 64 slide “Feature Engineering and Selection” (rekayasa dan seleksi fitur) secara berurutan, dengan asumsi Anda belum tahu apa-apa tentang materinya. Cara bacanya sama dengan Bagian 1 sampai 4.

Setiap slide memakai pola yang sama:

- **Isi slide**: apa yang dikatakan slide, dalam bahasa sehari-hari.
- **Istilah penting**: arti setiap istilah teknis.
- **Gambar dan diagram**: dijelaskan bagian demi bagian, bila ada.
- **Rumus**: asal-usul dan cara memakainya langkah demi langkah, bila ada. Bila slide tidak menuliskan rumus tetapi rumus membantu memahaminya, saya menambahkannya dan menandainya “tambahan dari saya”.
- **Analogi**, **Mengapa penting**, **Kaitan dengan slide sebelumnya**, dan **Catatan** (salah tulis, kejanggalan, atau hal yang tidak dijelaskan slide).
- **Contoh soal**: 2 sampai 8 soal latihan beserta pembahasannya. Coba jawab dulu sebelum membuka pembahasan.

Materi yang saya tambahkan di luar slide diberi tanda “contoh tambahan” atau “tambahan dari saya”. Bagian slide yang tidak dijelaskan dan saya tafsirkan diberi tanda “tafsiran saya” atau “dugaan saya”, sedangkan hal yang berasal dari pengetahuan umum saya, bukan dari slide, diberi tanda “sepengetahuan saya”. Angka atau fakta yang saya hitung atau periksa sendiri, dari tabel slide atau dengan menjalankan pustaka Python seperti *scikit-learn* versi 1.8, disebut “hasil hitung saya” atau “hasil periksa saya”: itu bukan isi slide. Contoh dengan angka karangan saya ditandai “(angka rekaan)”. Potongan kode *Python* beserta keluarannya adalah contoh tambahan dari saya, kecuali kode di slide 59 yang dikutip dari tangkapan layar slide itu. Angka yang disalin dari slide ditulis seperti di slide, dengan titik desimal (misalnya 0.94); angka dari hitungan saya memakai koma desimal dan titik pemisah ribuan (misalnya 0,94 dan 1.313). Rujukan ke Bagian lain ditulis lengkap, misalnya “Bagian 4, slide 39”; tulisan “slide 15” saja berarti slide di Bagian 5.

**Peta alur kuliah**

1. Bagian awal (slide 1–3): sampul, pengertian fitur (*feature*) lewat contoh tabel harga rumah, dan jenis fitur (numerik dan kategorikal).
2. Rekayasa fitur: pengertian dan proses (slide 4–7): pembatas berisi rujukan (slide 4), dua slide definisi rekayasa fitur (slide 5 dan 6), dan peta tiga proses: pembuatan, transformasi, dan ekstraksi fitur (slide 7).
3. Membuat fitur baru (slide 8–11): agregasi, rasio, *age encoding*, dan *indicator encoding*, dengan contoh deteksi penipuan kartu kredit.
4. Encoding data kategorik (slide 12–21): *one-hot encoding* (slide 12), *target encoding* (slide 13 sampai 17), *label encoding* (slide 18), *frequency encoding* (slide 19), lalu dua slide perbandingan (slide 20 dan 21).
5. Binarisasi, binning, penskalaan, dan Bag of Words (slide 22–30): mengubah angka menjadi 0 atau 1 (slide 22), mengelompokkan nilai (slide 23 dan 24), dua cara penskalaan (slide 25 dan 26), mengubah teks menjadi angka dengan *Bag of Words* (slide 27 sampai 29), dan alasan rekayasa fitur penting (slide 30).
6. Kutukan dimensi dan pengantar seleksi fitur (slide 31–36): mengapa fitur yang terlalu banyak bisa merugikan (slide 31), dua jalan keluar (slide 32), pembuka bab seleksi fitur (slide 33), definisi dan tujuan seleksi fitur (slide 34 dan 35), dan peta tiga keluarga teknik seleksi (slide 36).
7. Metode filter (slide 37–54): pengantar (slide 37), rasio nilai kosong (slide 38), ambang varians (slide 39), koefisien korelasi (slide 40), uji chi-kuadrat dengan contoh data Titanic (slide 41 sampai 45), *information gain* dengan contoh tabel 14 baris (slide 46 sampai 53), dan fungsinya di *scikit-learn* (slide 54).
8. Metode wrapper (slide 55–61): pengantar (slide 55), seleksi maju dan mundur berurutan atau SFS dan SBS (slide 56 sampai 58), kodenya di *scikit-learn* (slide 59), versi “mengambang” atau SFFS (slide 60), dan seleksi menyeluruh (slide 61).
9. Metode embedded (slide 62–64): pengantar (slide 62), pohon keputusan sebagai contoh pertama (slide 63), dan regresi Lasso sebagai contoh kedua (slide 64).

**Peta: masalah pada fitur dan teknik yang menanganinya**

| Masalah yang dihadapi | Teknik yang menanganinya | Slide |
| --- | --- | --- |
| Perlu ciri baru dari data yang ada, misalnya ringkasan, rasio, umur, atau penanda | Pembuatan fitur: agregasi, rasio, *age encoding*, *indicator encoding* | 8–11 |
| Fitur berupa kategori (kota, nama toko, kode pos) tidak bisa langsung dimakan model | Pengodean kategorik: *one-hot*, *target*, *label*, dan *frequency encoding* | 12–21 |
| Angka terlalu halus, atau skala antarkolom berjauhan | Binarisasi, *binning*, dan penskalaan (*min-max*, *simple feature scaling*) | 22–26 |
| Data berupa teks | *Bag of Words* | 27–29 |
| Fitur terlalu banyak sehingga model justru memburuk (kutukan dimensi) | Seleksi fitur atau reduksi dimensi | 31–36 |
| Ingin menyaring fitur dengan cepat tanpa melatih model | Metode filter: rasio nilai kosong, ambang varians, korelasi, chi-kuadrat, *information gain* | 37–54 |
| Ingin memilih fitur menurut kinerja model yang benar-benar dilatih | Metode wrapper: SFS, SBS, SFFS, seleksi menyeluruh | 55–61 |
| Ingin seleksi terjadi sekaligus saat model dilatih | Metode embedded: pohon keputusan, Lasso | 62–64 |

**Catatan tentang file slide ini**

1. Nomor slide lengkap, 1 sampai 64. Sampul (slide 1) tidak menampilkan nomor. Pojok kiri atas slide 37 sampai 64 memuat label bab berwarna: “Filter methods” (ungu, slide 37 sampai 54), “Wrapper methods” (biru, slide 55 sampai 61), dan “Embedded methods” (ungu muda, slide 62 sampai 64). Slide 1 sampai 36 tidak berlabel.
2. Slide 4 dan 33 adalah slide pembatas yang hanya memuat judul dan daftar rujukan: slide 4 membuka bagian rekayasa fitur, slide 33 membuka bab seleksi fitur. Slide 37, 55, dan 62 membuka tiga keluarga metode seleksi, masing-masing dengan sebuah diagram alur.
3. Teks slide berbahasa Inggris, kecuali butir-butir slide 57 dan 58 serta tabel dan pohon di slide 63 yang berbahasa Indonesia. Pada heading saya memakai judul asli slide, termasuk tanda “(2)”, “(3)”, dan seterusnya yang tertulis pada judul slide; beberapa slide berurutan memakai judul yang persis sama, yaitu slide 5 dan 6, slide 13 dan 14, serta slide 16 dan 17.
4. Ada beberapa salah tulis di file sumber. Saya sebut di slide terkait dan tidak memperbaikinya diam-diam: “Mechant” (slide 13); “0.66” yang sebenarnya 0,666… dipotong, dan kepala kolom “Column” (slide 14); label blok klasifikasi dan regresi yang tertukar (slide 16); kata “unique” pada tokenisasi (slide 28); “158.13” padahal tabelnya 158.33 (slide 44); “sort … sort” (slide 45); “3 value” padahal hanya dua nilai (slide 51); “0.479” yang semestinya 0.0479 (slide 52); “worse” untuk “worst” (slide 56); “X = 0” yang maksudnya himpunan kosong, dan “inX” (slide 60); “combines” (slide 62); serta tanda “+” yang hilang pada rumus slide 64. Gaya angka slide 25 dan 26 juga berbeda (koma dan titik sebagai pemisah ribuan), dan nilai bawaan `'warn'` pada tangkapan layar slide 59 berasal dari dokumentasi versi lama.
5. Ada kejanggalan isi: slide 2 memakai harga 1 sampai 3 juta rupiah untuk rumah seluas 80 sampai 200 m² (dugaan saya, yang dimaksud miliar); slide 3 menyebut tiga jenis fitur, tetapi tabelnya hanya memuat dua; slide 6 memasukkan “selecting” ke dalam rekayasa fitur, sedangkan slide 7 hanya mendaftar tiga proses tanpa seleksi; slide 9 berjudul “Differences and Ratios”, tetapi contohnya hanya rasio; slide 18 dan 20 menggambarkan *label encoding* secara berbeda (menurut urutan atau sembarang); slide 31 berjudul kutukan dimensi, tetapi hanya menyajikan satu wujudnya (Hughes Phenomenon); diagram slide 36 menaruh *filter* di bawah *supervised*, padahal metode di slide 38 dan 39 tidak memakai label; slide 42 hanya menampilkan cuplikan sepuluh baris, sedangkan hitungan chi-kuadrat di slide 44 memakai 1.313 penumpang; slide 55 menyebut empat contoh metode wrapper, tetapi hanya tiga yang dibahas; dan slide 64 berjudul Lasso, tetapi penalti yang menjadi inti Lasso tidak disebut sama sekali. Rinciannya ada di slide terkait.
6. Tautan di slide tidak saya buka; keterangan sumber di kaki slide (misalnya slide 5, 8 sampai 13, 20, 21, 30, 31, 34, 37, 40, dan 42) saya cantumkan apa adanya. Pada slide 54, 59, 63, dan 64, perilaku pustaka Python (*scikit-learn*) saya periksa dengan menjalankannya sendiri.
