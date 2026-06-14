## **PROPOSAL TUGAS BESAR TANICHECK MATA KULIAH KECERDASAN BUATAN** 

Dosen Pengampu: 

Dr. Helmie Arif Wibawa, S.Si., M.Cs. 

Disusun Oleh: 

Dian Berlian Hutasoit - 24060124120005 Husni Ulyaa Khanifah - 24060124120021 Nabila Kayla Rafa - 24060124120022 Muhammad Izzat Fauzan Putra Arya - 24060124130096 Muhammad Rofad Hamdani - 24060124130117 

## **FAKULTAS SAINS DAN MATEMATIKA UNIVERSITAS DIPONEGORO** 

## **SEMARANG** 

**2026** 

## **KATA PENGANTAR** 

Puji syukur kami panjatkan kepada Tuhan Yang Maha Esa karena proposal Tugas Besar AI For Real Impact 2026 ini dapat disusun sebagai rencana awal dari pengembangan aplikasi TaniCheck. Aplikasi ini direncanakan sebagai produk digital sederhana berbasis AI yang berfokus pada pengecekan kualitas visual sayur dan buah, pemberian estimasi harga wajar, serta penyusunan pesan negosiasi harga bagi pembeli awam di pasar. 

Proposal ini disusun berdasarkan identifikasi masalah nyata yang ditemukan melalui observasi di pasar, lingkungan sekitar, dan pengalaman pribadi. Permasalahan utama yang diangkat adalah kesulitan pembeli awam dalam membedakan kualitas sayur dan buah secara cepat, serta kebingungan dalam menentukan harga tawar yang tetap masuk akal ketika melakukan transaksi di pasar. 

Pembahasan dalam proposal ini difokuskan pada latar belakang masalah, ide solusi, target pengguna, fitur utama, teknologi dan AI tools yang digunakan, rencana prototipe, serta rencana validasi awal. Penyusunan proposal tidak diarahkan untuk menjelaskan rancangan sistem yang kompleks, melainkan untuk menunjukkan bagaimana AI dapat digunakan sebagai alat bantu problem solving terhadap masalah nyata yang dekat dengan kehidupan sehari-hari. 

Kami menyadari bahwa proposal ini masih dapat dikembangkan lebih lanjut, terutama pada bagian validasi pengguna, perluasan dataset, dan pengujian hasil klasifikasi. Namun, secara umum proposal ini telah menggambarkan arah pengembangan TaniCheck sebagai aplikasi yang dapat membantu pembeli mengambil keputusan transaksi secara lebih percaya diri dan terukur. 

Kami mengucapkan terima kasih kepada dosen pengampu atas arahan dan materi yang telah diberikan selama proses perkuliahan. Semoga proposal ini dapat menjadi dasar awal pengembangan prototipe yang bermanfaat dan dapat dilanjutkan ke tahap implementasi serta evaluasi. 

i 

## **DAFTAR ISI** 

**KATA PENGANTAR..................................................................................................................... i DAFTAR ISI...................................................................................................................................ii BAB I PENDAHULUAN...............................................................................................................1** 1.1. Latar Belakang....................................................................................................................1 1.2. Rumusan Masalah...............................................................................................................1 1.3. Tujuan Proyek.....................................................................................................................2 **BAB II DESKRIPSI PROYEK.................................................................................................... 3** 2.1. Deskripsi Proyek.................................................................................................................3 2.2. Target Pengguna..................................................................................................................3 2.3. Ide Solusi............................................................................................................................ 4 2.4. Manfaat Solusi.................................................................................................................... 4 **BAB III RENCANA PROTOTIPE.............................................................................................. 5** 3.1. Alur Kerja Sistem............................................................................................................... 5 3.2. Fitur Utama.........................................................................................................................5 3.3. Teknologi dan Alat AI yang Digunakan............................................................................. 6 3.4. Rencana Prototipe...............................................................................................................7 **BAB IV RENCANA VALIDASI DAN PENGEMBANGAN..................................................... 8** 4.1. Rencana Validasi Awal........................................................................................................8 4.2. Keterbatasan Prototipe........................................................................................................8 4.3. Potensi Pengembangan....................................................................................................... 9 **BAB V PENUTUP....................................................................................................................... 10** 5.1. Saran................................................................................................................................. 10 5.2. Kesimpulan....................................................................................................................... 10 

ii 

## **BAB I** 

## **PENDAHULUAN** 

## **1.1. Latar Belakang** 

Sayur dan buah merupakan bahan pangan yang sering dibeli secara langsung di pasar. Dalam proses pembelian tersebut, keputusan transaksi tidak hanya ditentukan oleh harga pasar, tetapi juga oleh kondisi visual barang yang akan dibeli. Pembeli biasanya menilai warna, bentuk, kesegaran, tingkat kematangan, dan kerusakan fisik sebelum menentukan apakah barang tersebut layak dibeli atau perlu ditawar dengan harga yang lebih rendah. 

Permasalahan muncul ketika pembeli awam belum memiliki kemampuan yang cukup untuk membedakan kualitas sayur dan buah secara cepat. Penilaian terhadap kualitas barang masih sangat bergantung pada pengalaman masing-masing orang, sehingga hasil penilaian dapat berbeda antara satu pembeli dengan pembeli lainnya. Kondisi ini membuat pembeli sering ragu ketika memilih barang, terutama ketika tampilan visual barang terlihat tidak sepenuhnya segar tetapi masih mungkin untuk dibeli. 

Selain kesulitan dalam menilai kualitas, pembeli awam juga sering mengalami kebingungan dalam menentukan harga tawar yang tepat. Pada transaksi pasar, proses tawar-menawar dilakukan dalam waktu singkat dan sering kali tidak memiliki acuan yang jelas. Akibatnya, pembeli dapat menawar terlalu rendah sehingga tidak realistis, atau menerima harga yang terlalu tinggi meskipun kualitas barang sebenarnya sudah menurun. 

Berdasarkan observasi di pasar, lingkungan sekitar, pertemanan, dan pengalaman pribadi, masalah tersebut cukup sering terjadi dalam pembelian sayur dan buah. Pembeli yang belum terbiasa menilai kualitas barang biasanya membutuhkan alat bantu sederhana yang dapat memberikan gambaran awal mengenai kondisi barang dan estimasi harga tawar yang masih masuk akal. Oleh karena itu, TaniCheck dirancang sebagai aplikasi web berbasis AI yang membantu pembeli awam membaca kualitas visual sayur dan buah dari foto, lalu mengubah hasil analisis tersebut menjadi rekomendasi harga yang mudah dipahami. 

## **1.2. Rumusan Masalah** 

1. Bagaimana membantu pembeli awam di pasar dalam membedakan kualitas sayur dan buah berdasarkan tampilan visual? 

1 

2. Bagaimana mengubah hasil penilaian visual menjadi rekomendasi harga tawar yang mudah dipahami oleh pengguna? 

3. Bagaimana merancang prototipe sederhana yang dapat digunakan untuk mengambil atau mengunggah foto, melakukan analisis kualitas, dan menampilkan estimasi harga wajar? 

4. Bagaimana memanfaatkan AI sebagai alat bantu dalam proses pengembangan solusi tanpa menjadikan hasil AI sebagai satu-satunya dasar keputusan? 

## **1.3. Tujuan Proyek** 

Tujuan dari proyek TaniCheck adalah untuk membuat rancangan prototipe aplikasi web sederhana yang dapat membantu pembeli awam dalam mengambil keputusan pembelian sayur dan buah di pasar. Secara khusus, tujuan proyek ini adalah sebagai berikut: 

1. Membantu pengguna menilai kualitas visual sayur dan buah dari foto secara lebih cepat dan sederhana. 

2. Memberikan rekomendasi harga wajar berdasarkan harga pasar dan hasil estimasi kualitas barang. 

3. Menyediakan informasi risiko, grade kualitas, tawaran awal, batas maksimal beli, dan pesan negosiasi yang dapat digunakan saat transaksi. 

4. Membuat prototipe web yang dapat didemokan sebagai bukti awal bahwa AI dapat digunakan untuk membantu menyelesaikan masalah nyata di lingkungan sekitar. 

2 

## **BAB II DESKRIPSI PROYEK** 

## **2.1. Deskripsi Proyek** 

TaniCheck merupakan nama produk yang digunakan dalam proyek Tugas Besar AI. Nama ini dipilih karena aplikasi diarahkan untuk membantu proses pengecekan kualitas hasil panen atau komoditas pangan, khususnya sayur dan buah, sebelum pengguna mengambil keputusan membeli atau menawar harga 

|**Komponen**|**Keterangan**|
|---|---|
|Nama Produk|TaniCheck|
|Judul Proyek|TaniCheck|
|Bidang Masalah|Pertanian, pasar tradisional, dan transaksi hasil panen|
|Target Utama|Pembeli awam di pasar yang belum terbiasa membedakan<br>kualitas sayur dan buah|
|Ruang Lingkup Komoditas|Sayur dan buah, dengan_Minimum Viable Product_(MVP) dan<br>demo awal menggunakan tomat|
|Bentuk Prototipe|Aplikasi web responsive/mobile-first|
|Link Deployment|tanicheck.vercel.app|



## **2.2. Target Pengguna** 

Target pengguna utama dari TaniCheck adalah pembeli awam di pasar. Pengguna yang dimaksud adalah orang yang membeli sayur dan buah secara langsung, tetapi belum memiliki pengalaman yang cukup untuk membedakan kualitas barang berdasarkan tampilan visual. Pengguna seperti ini biasanya hanya melihat warna dan bentuk barang secara sekilas, tanpa mengetahui apakah kualitas barang masih baik, mulai menurun, atau sudah tidak layak untuk dibeli dengan harga normal. 

Pemilihan pembeli awam sebagai target utama didasarkan pada kebutuhan yang paling dekat dengan masalah yang ditemukan. Pedagang atau petani umumnya lebih terbiasa menilai 

3 

kualitas barang karena sering berinteraksi dengan komoditas tersebut. Sebaliknya, pembeli awam lebih rentan mengalami kebingungan ketika harus memilih barang dalam waktu cepat dan menentukan harga tawar yang sesuai dengan kondisi barang. 

## **2.3. Ide Solusi** 

TaniCheck dirancang sebagai aplikasi web yang membantu pengguna mengecek kualitas visual sayur dan buah melalui foto. Pengguna dapat mengambil foto secara langsung menggunakan kamera atau mengunggah foto dari perangkat. Setelah itu, pengguna memasukkan harga pasar per kilogram, jumlah barang yang ingin dibeli, dan lokasi pasar sebagai konteks tambahan. 

Sistem kemudian akan menggunakan model klasifikasi gambar untuk membaca kemungkinan kualitas barang. Pada tahap prototipe, klasifikasi difokuskan pada tomat dengan label kualitas Bagus, Sedang, dan Busuk. Hasil klasifikasi tersebut tidak berhenti sebagai label AI saja, tetapi diolah kembali menjadi informasi yang lebih berguna untuk transaksi, seperti skor kualitas, risiko pembelian, grade, rekomendasi harga wajar, tawaran awal, batas maksimal beli, dan pesan negosiasi. 

Formula harga yang digunakan dalam TaniCheck dibuat sebagai pendekatan estimasi, bukan sebagai penentu harga mutlak. Tujuan dari formula ini adalah menjaga agar variasi harga tawar tetap masuk akal sesuai kondisi kualitas barang. Ketika kualitas visual barang tinggi, rekomendasi harga akan mendekati harga pasar. Sebaliknya, ketika kualitas visual menurun, sistem akan memberi rekomendasi tawar yang lebih rendah dan memberi alasan agar pengguna memahami dasar keputusan tersebut. 

## **2.4. Manfaat Solusi** 

Manfaat utama TaniCheck adalah membantu pembeli awam memiliki acuan awal sebelum mengambil keputusan transaksi. Aplikasi ini tidak menggantikan penilaian manusia secara penuh, tetapi membantu pengguna membaca kondisi barang dengan cara yang lebih terstruktur. Dengan adanya informasi kualitas, risiko, dan rekomendasi harga, pengguna dapat melakukan tawar-menawar dengan lebih percaya diri. 

4 

## **BAB III** 

## **RENCANA PROTOTIPE** 

## **3.1. Alur Kerja Sistem** 

Alur kerja TaniCheck dibuat sederhana agar dapat digunakan secara cepat oleh pembeli di pasar. Pengguna tidak perlu mengisi banyak data yang rumit, karena aplikasi hanya membutuhkan foto komoditas, harga pasar, jumlah beli, dan lokasi pasar. Alur kerja sistem yang direncanakan adalah sebagai berikut: 

1. Pengguna membuka aplikasi TaniCheck melalui browser. 

2. Pengguna mengambil foto sayur atau buah menggunakan kamera, atau mengunggah foto dari perangkat. 

3. Aplikasi menampilkan foto sebagai preview sebelum proses analisis dimulai. 

4. Pengguna memasukkan harga pasar per kilogram, jumlah beli, dan lokasi pasar. 

5. Model AI membaca foto dan menghasilkan probabilitas kualitas barang. 

6. Label dengan probabilitas tertinggi digunakan sebagai prediksi utama kualitas barang. 

7. Sistem mengubah hasil kualitas menjadi skor yang digunakan untuk menghitung estimasi harga wajar. 

8. Aplikasi menampilkan rekomendasi harga, risiko, grade, batas beli, dan pesan negosiasi yang dapat digunakan oleh pengguna. 

## **3.2. Fitur Utama** 

Fitur utama TaniCheck disusun berdasarkan kebutuhan pengguna pada proses transaksi di pasar. Fitur yang direncanakan tidak dibuat terlalu kompleks, tetapi harus cukup untuk menunjukkan hubungan antara input foto, hasil analisis AI, dan rekomendasi keputusan pembelian. 

|**No**|**Fitur**|**Keterangan**|
|---|---|---|
|1|Kamera|Pengguna dapat mengambil foto komoditas secara<br>langsung melalui perangkat.|
|2|Upload Foto|Pengguna dapat mengunggah gambar sayur atau buah dari<br>penyimpanan perangkat.|



5 

|3|Preview Foto|Foto yang dipilih ditampilkan terlebih dahulu sebelum<br>dianalisis.|
|---|---|---|
|4|Input Harga Pasar|Pengguna memasukkan harga pasar per kilogram sebagai<br>dasar estimasi harga.|
|5|Input Jumlah Beli|Pengguna memasukkan estimasi jumlah barang yang ingin<br>dibeli.|
|6|Input Lokasi|Lokasi pasar digunakan sebagai konteks agar rekomendasi<br>lebih mudah dijelaskan.|
|7|Prediksi Kualitas|Sistem menampilkan label kualitas seperti Bagus, Sedang,<br>atau Busuk.|
|8|Risiko dan Grade|Sistem memberikan gambaran risiko pembelian dan grade<br>kualitas barang.|
|9|Harga Wajar|Sistem menghitung estimasi harga wajar berdasarkan harga<br>pasar dan skor kualitas.|
|10|Pesan Negosiasi|Sistem membuat narasi tawar-menawar yang dapat<br>digunakan pengguna saat transaksi.|



## **3.3. Teknologi dan Alat AI yang Digunakan** 

Teknologi dan AI tools yang digunakan dalam TaniCheck dipilih berdasarkan kebutuhan prototipe yang ringan, mudah didemokan, dan dapat berjalan melalui browser. Pemilihan teknologi tidak diarahkan untuk membuat sistem AI yang kompleks, melainkan untuk membangun prototipe yang dapat menunjukkan solusi secara jelas. 

|**Komponen**|**Tools / Teknologi**|**Fungsi**|
|---|---|---|
|Brainstorming dan<br>penyusunan ide|ChatGPT|Membantu<br>merumuskan<br>masalah,<br>menyusun alur solusi, merancang<br>fitur,<br>dan<br>memperbaiki<br>narasi<br>proposal.|
|Bantuan implementasi<br>kode|Codex|Membantu proses pembuatan dan<br>perbaikan kode prototipe aplikasi.|
|Model klasifikasi<br>gambar|Google Teachable Machine|Membuat model klasifikasi visual<br>untuk<br>membedakan<br>kualitas<br>komoditas.|



6 

|Inferensi model di<br>browser|TensorFlow.js dan<br>@teachablemachine/image|Menjalankan<br>model<br>klasifikasi<br>langsung pada browser pengguna.|
|---|---|---|
|Frontend web|Next.js, React, TypeScript|Membangun struktur aplikasi web dan<br>interaksi pengguna.|
|Tampilan aplikasi|Tailwind CSS dan Lucide<br>React|Membantu<br>pembuatan<br>antarmuka<br>yang sederhana dan responsive.|
|Dataset|Dataset publik dari Kaggle<br>dan GitHub|Menjadi sumber awal foto untuk<br>pembuatan model klasifikasi.|
|Deployment|Vercel|Menjadi media deployment prototipe<br>agar dapat diakses melalui link web.|



## **3.4. Rencana Prototipe** 

Prototipe TaniCheck direncanakan berbentuk aplikasi web responsive dengan pendekatan mobile-first. Pendekatan ini dipilih karena target pengguna kemungkinan besar akan menggunakan aplikasi melalui ponsel ketika berada di pasar. Oleh karena itu, tampilan utama aplikasi dibuat sederhana, langsung mengarahkan pengguna untuk mengambil atau mengunggah foto, kemudian memasukkan data harga dan jumlah beli. 

Pada tahap awal, ruang lingkup prototipe difokuskan pada komoditas tomat sebagai _Minimum Viable Product_ . Pemilihan tomat dilakukan agar proses demo lebih terarah dan model klasifikasi dapat diuji pada satu jenis komoditas terlebih dahulu. Walaupun ruang lingkup masalah mencakup sayur dan buah, pengembangan awal perlu dibatasi agar prototipe dapat selesai, diuji, dan dijelaskan dengan baik. 

Prototipe direncanakan dapat diakses melalui link deployment tanicheck.vercel.app. Link tersebut digunakan sebagai media demo agar penguji dapat mencoba alur utama aplikasi dari proses input foto sampai keluarnya rekomendasi harga. 

7 

## **BAB IV** 

## **RENCANA VALIDASI DAN PENGEMBANGAN** 

## **4.1. Rencana Validasi Awal** 

Validasi awal TaniCheck direncanakan menggunakan pengujian sederhana terhadap beberapa foto tomat dengan kondisi kualitas yang berbeda. Foto yang diuji akan mencakup kondisi bagus, sedang, dan buruk agar sistem dapat dilihat kemampuannya dalam memberikan label kualitas. Pengujian ini belum diarahkan untuk mendapatkan akurasi model yang sangat tinggi, tetapi untuk memastikan prototipe dapat menunjukkan alur kerja utama secara masuk akal. 

Selain menguji hasil klasifikasi, validasi juga dilakukan terhadap hasil rekomendasi harga. Sistem perlu diperiksa apakah harga wajar, tawaran awal, dan batas maksimal beli berubah secara logis ketika kualitas barang menurun. Apabila kualitas barang dinilai bagus, rekomendasi harga seharusnya lebih dekat dengan harga pasar. Sebaliknya, apabila kualitas barang dinilai sedang atau buruk, rekomendasi harga seharusnya turun dengan alasan yang dapat dipahami. 

Validasi pengguna juga direncanakan dengan meminta beberapa calon pengguna atau teman untuk mencoba alur aplikasi. Bagian yang perlu diperiksa adalah apakah pengguna memahami arti label Bagus, Sedang, dan Busuk, apakah rekomendasi harga membantu proses tawar-menawar, apakah pesan negosiasi mudah digunakan, serta apakah alur kamera, upload, input harga, dan hasil analisis sudah cukup sederhana. 

## **4.2. Keterbatasan Prototipe** 

Sebagai prototipe awal, TaniCheck memiliki beberapa keterbatasan. Keterbatasan pertama adalah ruang lingkup demo yang masih difokuskan pada tomat, meskipun masalah utama yang diangkat mencakup sayur dan buah secara umum. Hal ini dilakukan agar proses pengembangan prototipe lebih realistis dan tidak terlalu melebar. 

Keterbatasan kedua adalah hasil prediksi visual masih bergantung pada kualitas foto. Pencahayaan, sudut pengambilan gambar, latar belakang, dan ketajaman foto dapat memengaruhi hasil klasifikasi. Oleh karena itu, hasil prediksi dari model tidak boleh dianggap sebagai keputusan final tanpa pertimbangan pengguna. 

8 

Keterbatasan ketiga adalah formula harga masih bersifat estimasi. Formula tersebut digunakan untuk membantu membuat variasi harga tawar tetap masuk akal, bukan untuk menggantikan harga pasar yang sebenarnya. Harga di pasar dapat dipengaruhi oleh musim, pasokan, lokasi, ukuran barang, varietas, dan kondisi permintaan pada saat transaksi. 

## **4.3. Potensi Pengembangan** 

TaniCheck masih memiliki ruang pengembangan yang cukup luas. Pada tahap berikutnya, aplikasi dapat dikembangkan agar mendukung lebih banyak komoditas, seperti cabai, bawang, kentang, dan buah-buahan. Penambahan komoditas tersebut perlu diikuti dengan dataset yang lebih besar dan lebih beragam agar model dapat memberikan hasil prediksi yang lebih stabil. 

Pengembangan berikutnya juga dapat diarahkan pada peningkatan formula harga dengan menambahkan faktor ukuran, tingkat kematangan, musim, lokasi pasar, dan data harga lokal. Dengan adanya data harga yang lebih kontekstual, rekomendasi harga dapat menjadi lebih relevan bagi pengguna di berbagai wilayah. 

Selain itu, TaniCheck dapat dikembangkan menjadi aplikasi mobile offline agar lebih mudah digunakan di pasar yang koneksi internetnya tidak selalu stabil. Fitur riwayat analisis, dashboard sederhana, dan catatan pembelian juga dapat ditambahkan apabila aplikasi ingin diarahkan untuk pedagang kecil, koperasi, atau kelompok pembeli yang lebih luas. 

9 

## **BAB V** 

## **PENUTUP** 

## **5.1. Saran** 

Berdasarkan rancangan awal yang telah disusun, pengembangan TaniCheck perlu difokuskan terlebih dahulu pada penyelesaian alur utama prototipe. Alur kamera atau upload foto, input harga pasar, input jumlah beli, analisis kualitas, dan output rekomendasi harga harus dipastikan berjalan dengan baik sebelum fitur tambahan dikembangkan. 

Selain itu, dataset yang digunakan perlu diperluas dan divalidasi secara bertahap. Karena model awal menggunakan dataset publik dari Kaggle dan GitHub, pengujian tambahan dengan foto yang diambil langsung dari kondisi pasar tetap diperlukan agar hasil klasifikasi lebih sesuai dengan situasi nyata. Validasi pengguna juga perlu dilakukan agar hasil aplikasi tidak hanya benar secara teknis, tetapi juga mudah dipahami oleh pembeli awam 

## **5.2. Kesimpulan** 

TaniCheck merupakan rancangan aplikasi web berbasis AI yang bertujuan membantu pembeli awam di pasar dalam menilai kualitas sayur dan buah serta menentukan estimasi harga tawar yang lebih masuk akal. Masalah yang diangkat berasal dari observasi di pasar, lingkungan sekitar, dan pengalaman pribadi terkait kesulitan membedakan kualitas barang serta kebingungan dalam melakukan tawar-menawar. 

Solusi yang ditawarkan adalah aplikasi yang membaca foto komoditas, mengklasifikasikan kualitas visual, lalu mengubah hasil tersebut menjadi informasi praktis berupa skor kualitas, risiko, grade, harga wajar, tawaran awal, batas maksimal beli, dan pesan negosiasi. Pada tahap _Minimum Viable Product_ , prototipe difokuskan pada komoditas tomat agar proses pengembangan dan demo dapat dilakukan secara terarah. 

Secara keseluruhan, proposal ini menunjukkan bahwa pemanfaatan AI dalam TaniCheck tidak diarahkan untuk membuat sistem yang terlalu kompleks, tetapi untuk membantu menyelesaikan masalah nyata yang dekat dengan kehidupan sehari-hari. Dengan pengembangan prototipe, validasi awal, dan perluasan dataset, TaniCheck berpotensi menjadi alat bantu transaksi hasil panen yang sederhana, praktis, dan bermanfaat bagi pembeli awam. 

10 

