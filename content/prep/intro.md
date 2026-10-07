Bagian ini menjelaskan 58 slide “Data Preparation” (persiapan data) secara berurutan, dengan asumsi Anda belum tahu apa-apa tentang materinya. Cara bacanya sama dengan Bagian 1 sampai 3.

Setiap slide memakai pola yang sama:

- **Isi slide**: apa yang dikatakan slide, dalam bahasa sehari-hari.
- **Istilah penting**: arti setiap istilah teknis.
- **Gambar dan diagram**: dijelaskan bagian demi bagian, bila ada.
- **Rumus**: asal-usul dan cara memakainya langkah demi langkah, bila ada. Bila slide tidak menuliskan rumus tetapi rumus membantu memahaminya, saya menambahkannya dan menandainya “tambahan dari saya”.
- **Analogi**, **Mengapa penting**, dan **Kaitan dengan slide sebelumnya**.
- **Contoh soal**: 2–4 soal latihan beserta pembahasannya. Coba jawab dulu sebelum membuka pembahasan.

Materi yang saya tambahkan di luar slide diberi tanda “contoh tambahan”, “tambahan dari saya”, atau “tambahan dari sumber luar”, dan yang berasal dari halaman web atau berkas data yang saya buka disertai keterangan sumbernya. Angka yang saya hitung sendiri dari tabel atau gambar slide disebut “hasil hitung saya” atau “hasil ukur saya”: itu bukan angka dari slide. Rujukan ke Bagian lain ditulis lengkap, misalnya “Bagian 3, slide 39”; tulisan “slide 15” saja berarti slide di Bagian 4.

**Peta alur kuliah**

1. Bagian awal (slide 1–5): sampul, rujukan, outline, dan letak persiapan data dalam siklus CRISP-DM (slide 5).
2. Data “kotor” (slide 6–10): mengapa data dunia nyata biasanya kotor, prinsip “sampah masuk, sampah keluar” (*garbage in, garbage out*), contoh masalah pada data survei, dan pengertian persiapan data beserta kelompok tekniknya.
3. Pembersihan data (slide 11–25): *data munging*, tiga ciri data kotor (tidak lengkap, bising, tidak konsisten), dan cara menangani masing-masing.
4. Integrasi data (slide 26–31): menggabungkan beberapa sumber data, konflik nilai, identifikasi entitas, dan data berlebih, ditutup dengan contoh hitungan korelasi.
5. Transformasi data (slide 32–35): lima jenis transformasi, lalu tiga cara normalisasi.
6. Seleksi dan reduksi data (slide 36–41): memilih kolom dan baris, enam strategi reduksi, agregasi kubus data, dan kompresi data.
7. Diskretisasi data (slide 42–44): mengubah nilai kontinu menjadi kelompok, terutama dengan *binning*.
8. Ringkasan dan contoh lengkap (slide 45–58): ringkasan, lalu tiga contoh berurutan yang memakai data konsumsi anggur dan data India untuk mempraktikkan semua langkah di atas.

**Peta: masalah pada data dan langkah persiapannya**

| Masalah yang dihadapi | Langkah persiapan | Slide |
| --- | --- | --- |
| Ada nilai kosong, nilai mustahil, atau penulisan yang tidak seragam | Pembersihan data (*data cleaning*) | 12–25 |
| Data tersebar di beberapa sumber; atribut bernama beda atau kembar | Integrasi data (*data integration*) | 27–31 |
| Skala atribut berbeda jauh; bentuk data belum sesuai kebutuhan sistem | Transformasi data (*data transformation*), termasuk normalisasi | 33–35 |
| Terlalu banyak kolom atau baris untuk tugas yang dikerjakan | Seleksi dan reduksi data (*data selection*, *data reduction*) | 37–41 |
| Nilai kontinu perlu dijadikan kelompok | Diskretisasi data (*data discretization*) | 43–44 |
| Semua masalah di atas muncul pada satu dataset | Contoh lengkap data konsumsi anggur | 47–58 |

**Catatan tentang file slide ini**

1. Nomor slide lengkap, 1 sampai 58. Sampul (slide 1) tidak menampilkan nomor. Pojok kiri atas slide isi memuat label bab berwarna: “Data Cleaning” (slide 12 sampai 25), “Data Integration” (27 sampai 31), “Data Transformation” (33 sampai 35), “Data Reduction” (37 sampai 41), dan “Data Discretization” (43). Slide 44 sampai 58 tidak berlabel.
2. Slide 3, 4, 11, 26, 32, 36, dan 42 adalah slide “Outline”: slide 3 memuat seluruh outline tujuh butir, sedangkan enam lainnya menyorot satu bab dan berfungsi sebagai penanda pergantian bab (slide 36 menyorot dua butir sekaligus, *Data Selection* dan *Data Reduction*). Slide 46 (“Examples”) adalah pembatas yang membuka contoh lengkap.
3. Teks slide berbahasa Inggris, kecuali slide 2 yang sebagian berbahasa Indonesia. Pada heading saya memakai judul asli slide; slide “Outline” saya bedakan dengan keterangan “Outline: Bab …”.
4. Ada beberapa salah tulis di file sumber. Saya sebut di slide terkait dan tidak memperbaikinya diam-diam: judul buku pertama di slide 2, “missing value: in dataset” (slide 16), judul “Handling Noisy Data - 2” yang tidak punya pasangan “-1” (slide 23), “Danila” yang berubah menjadi “Daniela” (slide 24), kalimat tentang satuan metrik dan Inggris yang tersalin dari slide 28 ke slide 29, judul kolom “(xᵢ − ȳ)²” (slide 31; semestinya yᵢ), dan kata “and aggregation” yang tampaknya salah tempat (slide 33).
5. Ada kejanggalan isi: slide 12 menjanjikan “tiga metode utama” pembersihan tetapi tidak menyebut ketiganya; slide 45 menyebut *data balancing* padahal tidak ada slide yang membahasnya; slide 47 menyebut kolom “Deaths” sebagai kematian akibat alkohol, sedangkan slide 51 menyebutnya total kematian; slide 50 memakai satuan per 1.000.000 orang, sedangkan slide 51 per 100.000 orang; angka 2,95, 171, dan 750 pada slide 51 dan 52 tidak dapat saya cocokkan dengan baris tabel yang tampak; tabel slide 53 dan 54 memuat India dua kali (baris 10 dan 22) dan tidak memuat Israel, padahal tabel slide 55 memuat Israel di baris 10; keterangan tabel slide 54 masih “Table 2.6 … after data integration”, dan “Table 2.7” tidak muncul di slide mana pun. Rinciannya ada di slide terkait.
6. Slide 8 memuat tangkapan layar formulir yang menampilkan alamat surel seseorang; alamat itu tidak saya cantumkan. Slide 16 sampai 21 dan 44 memakai data mobil dari UCI Machine Learning Repository. Tautan di slide umumnya tidak saya buka; pengecualiannya halaman dataset UCI itu, yang saya buka untuk memastikan arti kolomnya (slide 16).
