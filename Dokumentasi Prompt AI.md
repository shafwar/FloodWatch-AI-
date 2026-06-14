## **LAPORAN DOKUMENTASI AI PADA TUGAS BESAR MATA KULIAH KECERDASAN BUATAN** 

Dosen Pengampu: 

Dr. Helmie Arif Wibawa, S.Si., M.Cs. 

Disusun Oleh: 

Dian Berlian Hutasoit - 24060124120005 Husni Ulyaa Khanifah - 24060124120021 Nabila Kayla Rafa - 24060124120022 Muhammad Izzat Fauzan Putra Arya - 24060124130096 Muhammad Rofad Hamdani - 24060124130117 

## **FAKULTAS SAINS DAN MATEMATIKA UNIVERSITAS DIPONEGORO** 

## **SEMARANG** 

**2026** 

## **KATA PENGANTAR** 

Puji syukur kami panjatkan kepada Tuhan Yang Maha Esa karena dokumentasi penggunaan AI untuk proyek TaniCheck dapat disusun sebagai bagian dari Tugas Besar AI For Real Impact 2026. Dokumen ini menjelaskan bagaimana kami menggunakan AI secara bertanggung jawab dalam proses memahami masalah, menyusun alur kerja sistem, membuat prototype, menyiapkan dataset, serta mengevaluasi hasil pengembangan. 

TaniCheck merupakan aplikasi web berbasis AI yang membantu pembeli awam di pasar mengecek kualitas visual komoditas dari foto, kemudian mengubah hasil analisis tersebut menjadi rekomendasi harga wajar yang mudah dipahami. Ide akhir TaniCheck merupakan hasil evaluasi dan keputusan kelompok. AI tidak digunakan sebagai pembuat ide final, melainkan sebagai partner diskusi untuk menguji arah solusi, menyederhanakan arsitektur, memberi acuan desain awal, membantu implementasi kode, serta mendukung proses pengolahan dataset. 

Riwayat penggunaan ChatGPT dan Codex menunjukkan bahwa beberapa ide awal dari AI masih terlalu generik, terlalu luas, atau kurang menyentuh pain point yang benar-benar dialami pengguna. Karena itu, kami tidak menerima hasil AI secara mentah. Kami menyeleksi, mengkritisi, dan merevisi output AI sampai solusi yang dipilih lebih relevan dengan masalah nyata, yaitu keraguan pembeli awam dalam menilai kualitas barang dan menentukan harga tawar yang masuk akal. 

Dokumen ini juga menegaskan bahwa pemanfaatan AI dalam proyek tidak menghilangkan peran pemahaman manusia. Setiap rekomendasi AI tetap diperiksa kembali, disesuaikan dengan kebutuhan proyek, dan diuji melalui alur _prototype_ . Dengan demikian, dokumentasi ini diharapkan dapat menunjukkan bahwa AI digunakan sebagai alat bantu berpikir dan pengembangan, bukan sebagai pengganti tanggung jawab kelompok. 

i 

## **DAFTAR ISI** 

**KATA PENGANTAR..................................................................................................................... i DAFTAR ISI................................................................................................................................... ii BAB I...............................................................................................................................................1 PENDAHULUAN.........................................................................................................................................1** 1.1. Latar Belakang Penggunaan AI.......................................................................................... 1 1.2. Tujuan Dokumentasi AI......................................................................................................1 1.3. Pernyataan Peran AI dan Orisinalitas Ide...........................................................................2 **BAB II............................................................................................................................................. 3 RINGKASAN PROYEK DAN POSISI AI................................................................................................3** 2.1. Ringkasan Proyek............................................................................................................... 3 2.2. Alur Kerja Sistem............................................................................................................... 3 2.3. Posisi AI dalam Sistem.......................................................................................................4 **BAB III............................................................................................................................................5 DOKUMENTASI PENGGUNAAN AI...................................................................................................... 5** 3.1. Alat AI yang Digunakan.....................................................................................................5 3.2. Penggunaan ChatGPT.........................................................................................................6 3.3. Penggunaan Codex..............................................................................................................7 3.4. Ringkasan Prompt dan Keputusan......................................................................................7 **BAB IV............................................................................................................................................9 VALIDASI DAN REVISI............................................................................................................................ 9** 4.1. Validasi Ide..........................................................................................................................9 4.2. Validasi Alur Sistem dan Arsitektur................................................................................... 9 4.3. Validasi Desain....................................................................................................................9 4.4. Validasi Dataset dan Model.............................................................................................. 10 4.5. Kekurangan AI dan Perbaikan..........................................................................................10 **BAB V............................................................................................................................................11 REFLEKSI DAN KESIMPULAN............................................................................................................11** 5.1. Manfaat AI........................................................................................................................ 11 5.2. Keterbatasan AI.................................................................................................................11 5.3. Kesimpulan....................................................................................................................... 11 **LAMPIRAN..................................................................................................................................13** 

ii 

## **BAB I** 

## **PENDAHULUAN** 

## **1.1. Latar Belakang Penggunaan AI** 

Perkembangan AI memberikan peluang untuk mempercepat proses pengembangan produk digital sederhana. Dalam proyek TaniCheck, AI tidak digunakan sebagai pengganti proses berpikir kami, melainkan sebagai alat bantu untuk memperjelas masalah, menguji arah solusi, memahami alur sistem, dan mempercepat pekerjaan teknis yang berulang. 

Pada tahap awal, ChatGPT digunakan untuk mengeksplorasi beberapa masalah nyata yang berpotensi dibantu AI. Hasil eksplorasi tersebut tidak langsung dijadikan ide final. Beberapa saran AI dinilai masih terlalu umum, terlalu luas, atau kurang menyentuh _pain point_ yang benar-benar dialami pengguna. Karena itu, kami tetap melakukan penyaringan berdasarkan kedekatan masalah, target pengguna, dan kelayakan _prototype_ . 

Codex digunakan pada tahap teknis untuk membantu pembuatan kode, _debugging_ , dan penyusunan skrip _dataset_ . Bantuan tersebut mempercepat pekerjaan, tetapi tidak membuat kami menerima hasil kode secara mentah. Kode, struktur folder, alur model, dan hasil pengolahan _dataset_ tetap diperiksa agar sesuai dengan kebutuhan _prototype_ TaniCheck. 

## **1.2. Tujuan Dokumentasi AI** 

Tujuan dari dokumentasi ini adalah untuk menjelaskan penggunaan AI dalam proses pengembangan TaniCheck secara jelas dan bertanggung jawab. Secara khusus, tujuan dokumentasi ini adalah sebagai berikut: 

1. Menjelaskan AI tools yang digunakan selama proses pengerjaan TaniCheck. 

2. Menunjukkan bagaimana AI membantu proses eksplorasi, perancangan alur kerja, implementasi _prototype_ , dan pengolahan dataset. 

3. Mendokumentasikan prompt atau instruksi penting, hasil yang diberikan AI, serta keputusan kelompok setelah mengevaluasi hasil tersebut. 

4. Menegaskan bahwa hasil AI tidak digunakan secara mentah, tetapi divalidasi, direvisi, dan disesuaikan dengan kebutuhan proyek. 

5. Menjelaskan bahwa ide akhir TaniCheck berasal dari evaluasi kami terhadap masalah nyata, bukan dari hasil generate AI. 

1 

## **1.3. Pernyataan Peran AI dan Orisinalitas Ide** 

Berdasarkan riwayat chat yang digunakan selama pengerjaan, AI memang membantu memberi alternatif masalah dan contoh bentuk produk. Salah satu arah awal yang sempat dieksplorasi adalah PanenAI atau PanenClock, yaitu konsep yang membantu keputusan pascapanen terhadap komoditas mudah busuk. Namun, setelah dievaluasi, konsep tersebut tidak digunakan sebagai ide akhir. Kami menilai bahwa petani dan pedagang pada umumnya sudah memiliki pengalaman visual yang cukup untuk membedakan barang yang layak dan tidak layak. Oleh karena itu, titik masalah kemudian dialihkan kepada pembeli awam di pasar, yaitu pengguna yang lebih sering ragu ketika menilai kualitas barang dan menentukan harga tawar yang masuk akal. Dengan demikian, TaniCheck merupakan ide akhir yang dirumuskan oleh kami. AI berperan sebagai alat bantu untuk menguji, memperjelas, dan menyederhanakan alur solusi. Keputusan mengenai masalah, target pengguna, fitur utama, dan bentuk akhir _prototype_ tetap ditentukan oleh kami. 

## **BAB II RINGKASAN PROYEK DAN POSISI AI** 

## **2.1. Ringkasan Proyek** 

TaniCheck merupakan aplikasi web berbasis AI yang membantu pembeli awam mengecek kualitas visual sayur dan buah melalui foto. Pada tahap _Minimum Viable Product_ , ruang lingkup _prototype_ difokuskan pada komoditas tomat dengan label kualitas Bagus, Sedang, dan Busuk. Hasil klasifikasi gambar tidak berhenti sebagai label AI saja. Label tersebut diolah kembali menjadi informasi yang lebih praktis untuk transaksi, yaitu skor kualitas, risiko pembelian, grade, rekomendasi harga wajar, tawaran awal, batas maksimal beli, dan pesan negosiasi. 

|negosiasi.||
|---|---|
|**Komponen**|**Keterangan**|
|Nama Produk|TaniCheck|
|Tagline|Cek kualitas. Hitung harga wajar.|
|Bidang Masalah|Pertanian, pasar tradisional, dan transaksi komoditas pangan|
|Target Pengguna|Pembeli awam di pasar yang belum terbiasa menilai kualitas sayur<br>dan buah|
|Ruang Lingkup MVP|Klasifikasi kualitas tomat dengan label Bagus, Sedang, dan Busuk|
|Bentuk Prototype|Aplikasi web responsive dengan pendekatan mobile-first|
|Link Deployment|tanicheck.vercel.app|



## **2.2. Alur Kerja Sistem** 

Alur kerja TaniCheck dibuat sederhana agar dapat digunakan secara cepat di pasar. Pengguna tidak perlu memahami proses AI secara teknis, karena sistem hanya meminta _input_ yang berkaitan langsung dengan transaksi. 

1. Pengguna membuka aplikasi TaniCheck melalui _browser_ . 

2. Pengguna mengambil foto tomat melalui kamera atau mengunggah foto dari perangkat. 

3. Aplikasi menampilkan foto sebagai _preview_ sebelum proses analisis dilakukan. 

4. Pengguna memasukkan harga pasar per kilogram, jumlah beli, dan lokasi pasar. 

5. Model klasifikasi gambar membaca foto dan menghasilkan probabilitas label kualitas. 

6. Label dengan probabilitas tertinggi digunakan sebagai prediksi utama. 

3 

7. Sistem mengubah hasil kualitas menjadi skor untuk menghitung rekomendasi harga. 

8. Aplikasi menampilkan risiko, _grade_ , harga wajar, batas beli, dan pesan negosiasi. 

## **2.3. Posisi AI dalam Sistem** 

AI dalam TaniCheck ditempatkan sebagai salah satu komponen dalam alur sistem, bukan sebagai satu-satunya penentu keputusan. Model klasifikasi gambar berperan membaca kualitas visual, sedangkan logika keputusan harga tetap dirancang agar hasilnya transparan dan mudah dijelaskan. Pendekatan ini dipilih agar pengguna tidak hanya menerima label seperti Bagus, Sedang, atau Busuk, tetapi juga memahami alasan transaksi yang diberikan. Dengan demikian, TaniCheck tidak hanya menunjukkan penggunaan AI, tetapi juga mengubah hasil AI menjadi rekomendasi yang lebih berguna bagi pengguna. 

4 

## **BAB III** 

## **DOKUMENTASI PENGGUNAAN AI** 

## **3.1. Alat AI yang Digunakan** 

Alat AI yang digunakan dalam pengerjaan TaniCheck dipilih berdasarkan kebutuhan pengembangan prototype. Pemilihan tools tidak diarahkan untuk membuat sistem yang terlalu kompleks, melainkan untuk membantu kami menyusun alur solusi, membangun prototype, dan memahami proses teknis yang digunakan. 

|**Aktivitas**|**Tools / Teknologi**|**Peran dalam Proyek**|**Batasan**<br>**Penggunaan**|
|---|---|---|---|
|Eksplorasi<br>dan<br>evaluasi ide|ChatGPT|Membantu memetakan<br>masalah dan menguji<br>kekuatan pain point.|Tidak<br>digunakan<br>sebagai penentu ide<br>final.|
|Perancangan alur<br>sistem|ChatGPT|Membantu menjelaskan<br>alur dari foto sampai<br>rekomendasi harga.|Alur<br>akhir<br>disederhanakan<br>dan<br>diputuskan<br>oleh<br>kami.|
|Acuan<br>desain<br>UI/UX|ChatGPT dan referensi<br>visual|Memberi acuan awal<br>layout,<br>dan<br>susunan<br>informasi.|Desain<br>akhir<br>dirapikan<br>secara<br>manual agar bersih,<br>fokus, dan simple.|
|Implementasi<br>kode|Codex|Membantu<br>pembuatan<br>struktur<br>kode,<br>_debugging_,<br>dan<br>integrasi model.|Kode tetap dibaca,<br>dijalankan,<br>dan<br>disesuaikan<br>dengan<br>proyek.|
|Pengolahan<br>dataset|Codex|Membantu<br>membuat<br>skrip pembagian folder<br>dan<br>penggabungan<br>gambar tomat.|Struktur folder, label,<br>dan sampel gambar<br>tetap dicek manual.|
|Model klasifikasi<br>gambar|Google Teachable<br>Machine|Melatih<br>model<br>klasifikasi<br>kualitas<br>tomat.|Model<br>digunakan<br>sebagai demo awal,|



5 

||||bukan klaim akurasi<br>final.|
|---|---|---|---|
|Inferensi<br>di<br>browser|TensorFlow.js dan<br>@teachablemachine/i<br>mage|Menjalankan<br>model<br>langsung di browser.|Hasil<br>prediksi<br>diposisikan<br>sebagai<br>estimasi<br>probabilistik.|



## **3.2. Penggunaan ChatGPT** 

ChatGPT digunakan terutama pada tahap konseptual dan perancangan sistem. Pada tahap eksplorasi awal, ChatGPT memberikan beberapa alternatif masalah nyata. Kami tidak langsung mengambil ide tersebut, tetapi menggunakan daftar tersebut sebagai bahan pembanding untuk melihat mana masalah yang paling dekat dengan pengguna dan paling mungkin dibuat menjadi _Minimum Viable Product_ . 

Ide awal yang sempat dieksplorasi adalah PanenAI atau PanenClock. Konsep tersebut berfokus pada keputusan pascapanen, seperti saran sortir, umur jual, risiko busuk, dan rekomendasi distribusi. Setelah dianalisis, kami menyadari bahwa target pengguna tersebut belum paling tepat karena petani dan pedagang umumnya sudah cukup terbiasa membaca kualitas barang secara visual. Dari evaluasi tersebut, kami merumuskan arah baru menjadi TaniCheck. Fokusnya bukan lagi membantu petani menentukan mana barang layak atau tidak, melainkan membantu pembeli awam yang sering ragu saat menilai kualitas barang dan menentukan harga tawar. Dalam tahap ini, ChatGPT digunakan untuk membantu menguji alur baru, bukan membuat ide final. 

ChatGPT juga digunakan untuk memahami arsitektur sistem. Bantuan yang diberikan meliputi penjelasan alur input foto, preview gambar, pemuatan model, prediksi label, konversi probabilitas menjadi skor kualitas, dan penghitungan harga wajar. Hasil tersebut membantu kami melihat bahwa AI hanya satu bagian dari sistem, sedangkan formula harga dan penyajian rekomendasi tetap perlu dirancang secara jelas. 

Pada bagian desain, ChatGPT digunakan sebagai acuan awal untuk _layout_ , struktur halaman, dan _color palette_ . Namun, hasil akhir tidak diserahkan kepada AI. Kami melakukan _refinement_ sendiri agar tampilan TaniCheck bersih, fokus, sederhana, dan hanya mengarahkan pengguna pada satu alur utama, yaitu cek foto lalu hitung rekomendasi harga. 

6 

## **3.3. Penggunaan Codex** 

Codex digunakan pada tahap implementasi teknis. Bantuan Codex diarahkan untuk mempercepat pekerjaan yang bersifat teknis, seperti menyusun struktur komponen, membantu debugging, dan memberi arahan integrasi model klasifikasi ke dalam aplikasi web. Sedangkan dalam proses pelatihan model, Codex digunakan untuk membantu membuat skrip pengolahan dataset. Dua kebutuhan utama adalah memecah database menjadi folder baru serta membuat dataset baru dari gabungan gambar tomat dari kelas yang ada. Bantuan ini digunakan agar dataset lebih mudah disusun ke dalam label Bagus, Sedang, dan Busuk. 

Walaupun Codex membantu membuat skrip, kami tetap bertanggung jawab terhadap isi dataset. Struktur folder, label kelas, komposisi gambar, dan kemungkinan kesalahan pengelompokan tetap diperiksa secara manual. Dengan cara ini, Codex digunakan sebagai alat bantu kerja, bukan sebagai pihak yang menentukan kebenaran data. 

## **3.4. Ringkasan Prompt dan Keputusan** 

|**Tahap**|**Prompt /**<br>**Instruksi Inti**|**Hasil AI**|**Keputusan Akhir**|
|---|---|---|---|
|Eksplorasi<br>Masalah|Carikan masalah nyata<br>yang dapat dibantu<br>AI, bukan sekadar<br>menempelkan AI ke<br>masalah|Diberikan beberapa<br>alternatif ide lintas<br>bidang|Ide disaring berdasarkan<br>urgensi, target_user_, dan<br>kelayakan MVP|
|Eksplorasi<br>PanenAI|Eksplor ide AI untuk<br>panen yang sederhana<br>tetapi peran AI-nya<br>terasa|Diberikan konsep<br>PanenAI untuk<br>keputusan pascapanen|Konsep dipakai sebagai<br>bahan evaluasi, tetapi<br>tidak dijadikan ide akhir|
|Evaluasi<br>Pengguna|Apakah konsep<br>pascapanen benar<br>menyelesaikan_pain_<br>_point_paling kuat?|Diberikan kekuatan dan<br>kelemahan alur<br>pascapanen|Mengubah fokus dari<br>petani/pedagang ke<br>pembeli awam|
|Perumusan<br>TaniCheck|Uji alur produk untuk<br>pembeli awam: foto<br>komoditas, baca<br>kualitas, lalu<br>keluarkan harga wajar|Diberikan penjelasan<br>alur foto, prediksi<br>kualitas dan<br>rekomendasi transaksi|TaniCheck ditetapkan<br>sebagai ide akhir|



7 

|Arsitektur<br>Sistem|Jelaskan arsitektur<br>sederhana untuk<br>_prototype_web<br>berbasis klasifikasi<br>gambar|Diberikan saran model<br>di browser<br>menggunakan<br>TensorFlow.js|Pendekatan yang ringan<br>dan mudah didemokan<br>dipilih|
|---|---|---|---|
|Desain UI/UX|Buat acuan layout<br>_mobile-first_untuk<br>aplikasi yang dipakai<br>cepat di pasar|Diberi susunan input,<br>preview, analisis, dan<br>hasil rekomendasi|Desain akhir<br>disederhanakan secara<br>manual agar lebih bersih<br>dan fokus|
|Formula<br>Harga|Ubah label bagus,<br>sedang, dan busuk<br>menjadi skor kualitas<br>dan harga wajar|Diberi penjelasan<br>hubungan label, skor,<br>dan rentang harga|Formula dibuat sebagai<br>estimasi transparan dan<br>bukan penentu harga|
|Integrasi<br>Model|Bantu integrasikan<br>model_Teachable_<br>_Machine_ke aplikasi<br>web|Diberi arahan pemuatan<br>model dan proses<br>prediksi gambar|Path model, metadata,<br>dan state aplikasi<br>disesuaikan dengan<br>proyek|
|Skrip Dataset|Buat skrip untuk<br>memecah dataset<br>menjadi folder baru<br>sesuai kebutuhan<br>_training_|Codex membantu<br>membuat skrip<br>pembagian dataset|Folder dan label tetap<br>diperiksa secara manual|
|Gabungan<br>Gambar<br>Tomat|Buat_dataset_baru dari<br>gabungan gambar<br>tomat dari kelas yang<br>ada|Codex membantu logika<br>penggabungan gambar<br>ke tiga label utama|Komposisi kelas dicek<br>agar dataset tetap masuk<br>akal untuk demo|



8 

## **BAB IV** 

## **VALIDASI DAN REVISI** 

## **4.1. Validasi Ide** 

Validasi ide dilakukan dengan menilai apakah saran AI benar-benar menyentuh masalah yang dialami pengguna. Pada tahap awal, konsep PanenAI/PanenClock terlihat menarik karena memiliki unsur AI yang jelas. Namun, setelah dibandingkan dengan kondisi pengguna, kami menilai bahwa konsep tersebut belum paling kuat untuk dijadikan solusi akhir. Revisi utama yang dilakukan adalah mengubah target pengguna. Petani dan pedagang dianggap sudah lebih terbiasa menilai kualitas barang, sedangkan pembeli awam lebih sering membutuhkan acuan sederhana sebelum membeli atau menawar. Perubahan ini menjadi dasar lahirnya TaniCheck sebagai ide akhir. 

## **4.2. Validasi Alur Sistem dan Arsitektur** 

Validasi alur sistem dilakukan dengan memastikan bahwa setiap input pengguna memiliki fungsi yang jelas. Foto digunakan untuk membaca kualitas visual, harga pasar digunakan sebagai dasar perhitungan, jumlah beli digunakan untuk memperkirakan total transaksi, dan lokasi pasar digunakan sebagai konteks informasi. Arsitektur akhir dibuat sederhana agar _prototype_ dapat berjalan melalui _browser_ . Model klasifikasi gambar dijalankan menggunakan TensorFlow.js dan @teachablemachine/image. Pendekatan ini dipilih karena lebih ringan untuk demo dibandingkan _object detection_ atau _inference backend_ yang membutuhkan konfigurasi lebih kompleks. 

## **4.3. Validasi Desain** 

Validasi desain dilakukan dengan melihat apakah tampilan akhir benar-benar membantu pengguna menyelesaikan tugas utama. AI memberi acuan awal berupa halaman input, _preview_ , analisis, dan hasil rekomendasi. Namun, acuan tersebut masih perlu dirapikan agar tidak terlalu ramai. Kami kemudian menyederhanakan layout menjadi satu alur utama, yaitu ambil atau unggah foto, isi data dasar, lakukan analisis, lalu baca rekomendasi. _Color palette_ hijau dan latar terang digunakan untuk menjaga hubungan dengan konteks pangan dan pertanian, tetapi tetap dibuat minimal agar informasi utama mudah dibaca. 

9 

## **4.4. Validasi Dataset dan Model** 

Validasi dataset dilakukan dengan memeriksa struktur folder, label, dan sampel gambar setelah skrip Codex dijalankan. Karena model _prototype_ difokuskan pada tomat, _dataset_ disusun menjadi tiga label utama, yaitu Bagus, Sedang, dan Busuk. Model yang dilatih tidak diposisikan sebagai sistem final yang sudah memiliki akurasi tinggi. Model digunakan untuk menunjukkan alur kerja awal, yaitu bagaimana foto dapat menghasilkan probabilitas kualitas, lalu probabilitas tersebut digunakan sebagai dasar estimasi harga. Dengan demikian, hasil model tetap diperlakukan sebagai estimasi yang perlu diuji lebih lanjut. 

## **4.5. Kekurangan AI dan Perbaikan** 

|**Kekurangan AI**|**Dampak**|**Perbaikan**|
|---|---|---|
|Ide awal terlalu luas dan<br>sebagian generik.|Proyek<br>menjadi<br>sekadar<br>mengikuti hasil AI tanpa<br>masalah yang kuat.|Ide disaring berdasarkan_pain_<br>_point_dan target pengguna.|
|Konsep PanenAI terlalu fokus<br>pada petani atau pedagang.|Solusi<br>tidak<br>menyasar<br>pengguna<br>yang<br>paling<br>membutuhkan bantuan.|Fokus<br>dipindahkan<br>ke<br>pembeli awam di pasar.|
|Saran fitur cenderung terlalu<br>banyak.|Prototype melebar dan sulit<br>selesai.|Fitur dibatasi pada foto, input<br>transaksi,<br>analisis,<br>dan<br>rekomendasi.|
|Acuan desain masih umum.|Tampilan bisa ramai dan<br>kurang fokus.|_Layout_dan_color palette_<br>dirapikan<br>manual<br>agar<br>sederhana.|
|Skrip dataset berisiko salah<br>label atau_data leakage_.|Model terlihat baik tetapi<br>tidak valid.|Folder, label, dan sampel<br>gambar diperiksa manual.|
|Prediksi model bisa salah.|Pengguna dapat menganggap<br>hasil<br>sebagai<br>keputusan<br>mutlak.|Hasil<br>ditulis<br>sebagai<br>rekomendasi awal dan tetap<br>membutuhkan pertimbangan<br>manusia.|



10 

## **BAB V** 

## **REFLEKSI DAN KESIMPULAN** 

## **5.1. Manfaat AI** 

AI memberikan manfaat pada proses pengembangan TaniCheck karena membantu kami mempercepat eksplorasi masalah, memahami struktur sistem, dan menyusun alur kerja prototype. ChatGPT membantu menjelaskan hubungan antara input foto, model klasifikasi, skor kualitas, dan rekomendasi harga. Dengan bantuan tersebut, kami dapat memahami bahwa sistem tidak hanya berisi model AI, tetapi juga memiliki logika keputusan yang harus dirancang secara sadar. 

Codex membantu pekerjaan teknis yang membutuhkan ketelitian, terutama pada implementasi kode dan pengolahan dataset. Bantuan Codex membuat proses pembuatan skrip dan _debugging_ menjadi lebih cepat. Namun, manfaat tersebut hanya terasa ketika hasilnya tetap diperiksa dan disesuaikan dengan kebutuhan proyek. 

## **5.2. Keterbatasan AI** 

Keterbatasan utama AI adalah kecenderungannya memberi jawaban yang terlihat masuk akal tetapi belum tentu sesuai dengan kondisi pengguna. Pada tahap awal, AI dapat memberikan ide yang menarik secara konsep, tetapi belum tentu memiliki empati terhadap _pain point_ yang benar-benar dialami masyarakat. 

AI juga tidak dapat menjamin bahwa kode, dataset, atau model yang dihasilkan langsung benar. Kode masih dapat mengalami _error_ , _dataset_ masih dapat mengandung kesalahan label, dan model masih dapat salah membaca gambar. Karena itu, kami tetap perlu melakukan pengecekan manual, pengujian, dan penyederhanaan agar hasil akhir dapat dipahami dan dipertanggungjawabkan. 

## **5.3. Kesimpulan** 

Dokumentasi ini menunjukkan bahwa penggunaan AI dalam proyek TaniCheck dilakukan secara bertanggung jawab. ChatGPT digunakan untuk eksplorasi, evaluasi ide, pemahaman arsitektur, dan penyusunan alur kerja. Codex digunakan untuk membantu implementasi kode, _debugging_ , serta pembuatan skrip pengolahan _dataset_ . Teachable Machine 

11 

dan TensorFlow.js digunakan untuk membangun model klasifikasi gambar yang dapat berjalan pada _prototype web_ . 

Ide akhir TaniCheck bukan berasal dari AI. AI memang membantu mengeksplorasi ide awal seperti PanenAI/PanenClock, tetapi konsep tersebut tidak digunakan sebagai solusi akhir, karena kami menilai pain point-nya belum paling kuat. Setelah evaluasi, kami merumuskan TaniCheck sebagai aplikasi untuk pembeli awam yang membutuhkan bantuan dalam menilai kualitas visual dan menentukan harga tawar yang wajar. 

Dengan pendekatan ini, TaniCheck tidak hanya menunjukkan pemanfaatan AI, tetapi juga menunjukkan pemahaman terhadap masalah, alur sistem, dan tanggung jawab dalam menggunakan teknologi. AI digunakan sebagai partner kerja, sedangkan keputusan akhir tetap berada pada kami. 

12 

## **LAMPIRAN** 

## **Lampiran A.** 

Lampiran ini memuat ringkasan bukti dari riwayat penggunaan AI. Bukti yang ditampilkan tidak berupa seluruh percakapan mentah, melainkan bagian yang menunjukkan perubahan arah berpikir dari eksplorasi ide menuju keputusan akhir TaniCheck. 

_Gambar A.1 Eksplorasi masalah awal dengan AI dan AI memberi banyak alternatif, tetapi belum_ 

_langsung menjadi ide final._ 

13 

## _Gambar A.2 Eksplorasi awal ke arah panen/pascapanen sebagai bahan diskusi._ 

14 

_Gambar A.3 AI membantu merumuskan konsep awal pascapanen, yang kemudian dievaluasi ulang oleh kelompok._ 

15 

_Gambar A.4 AI membantu memahami pendekatan demo, arsitektur web, dan deployment awal._ 

16 

## _Gambar A.5 Diskusi pemilihan Teachable Machine dan TensorFlow.js agar prototype dapat berjalan sederhana._ 

17 

## _Gambar A.6 Diskusi dataset tomat, penggabungan kelas, dan kebutuhan dataset demo._ 

18 

_Gambar A.7 Diskusi pemetaan kelas menjadi Bagus, Sedang, dan Busuk serta peringatan data leakage._ 

19 

## **Lampiran B.** 

Lampiran ini menunjukkan penggunaan Codex dalam membantu pengolahan dataset tomat, dengan pemetaan kelas gambar kedalam kategori Bagus, Sedang, dan Busuk, juga pengecekan kebutuhan generator dataset, pembuatan script pengolahan data, hingga hasil dataset seimbang yang digunakan untuk mendukung pelatihan model TaniCheck. 

_Gambar B.1 Klarifikasi awal penggunaan Codex untuk menyesuaikan struktur dataset tomat._ 

20 

_Gambar B.2 Diskusi pemetaan kelas dataset menjadi Bagus, Sedang, dan Busuk._ 

_Gambar B.3 Pengecekan ulang struktur folder dan kebutuhan generator dataset sebelum implementasi._ 

21 

_Gambar B.4 Implementasi script pengolahan dataset tomat dengan bantuan Codex._ 

_Gambar B.5 Hasil pembuatan dataset seimbang untuk kelas Bagus, Sedang, dan Busuk._ 

22 

