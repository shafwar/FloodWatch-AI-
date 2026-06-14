# **FLOOD WATCHER: WebGIS Pemantauan Potensi Banjir & Evaluasi Kelayakan Hunian Berbasis AI**

## **A. Identitas Kelompok**

* **Nama Kelompok:** FloodWatch AI  
* **Anggota 1:** Naufal Shafi Anwar- NIM: 24060122140185  
* **Anggota 2:** Farrel Syadi Ramadhan \- NIM: 24060122140181

## **B. 	Judul Proyek**

**Flood Watcher:** WebGIS Pemantauan Potensi Banjir dan Cuaca dengan Integrasi AI Assistant untuk Evaluasi Kelayakan Daerah Hunian.

## **C. 	Latar Belakang Masalah**

Banjir merupakan permasalahan tahunan di Indonesia yang menimbulkan kerugian material maupun imaterial yang sangat besar. Seiring dengan anomali cuaca dan perubahan tata ruang kota, daerah yang sebelumnya aman kini bisa menjadi titik rawan banjir.

Terdapat sebuah **kesenjangan informasi (information gap)** di masyarakat. Data cuaca dan peringatan dini sebenarnya sudah disediakan secara publik oleh BMKG. Namun, data tersebut seringkali masih berupa data mentah (raw data) atau peta teknis yang sulit dipahami secara cepat oleh masyarakat awam.

Hal ini menimbulkan masalah nyata bagi beberapa pihak, khususnya:

1. **Masyarakat Umum:** Kesulitan memantau pergerakan ancaman banjir secara *real-time* di wilayah sekitarnya untuk kebutuhan evakuasi atau mitigasi.  
2. **Calon Pembeli Properti (Rumah/Tanah):** Seringkali tertipu atau kekurangan informasi mengenai riwayat banjir serta kondisi mikroklimat (seperti tingkat kelembapan dan suhu ekstrem) di daerah incaran mereka, yang berujung pada kerugian investasi finansial jangka panjang.

Oleh karena itu, diperlukan sebuah platform yang tidak hanya sekadar "menampilkan peta", tetapi mampu "menerjemahkan" data lingkungan yang kompleks menjadi rekomendasi praktis menggunakan bahasa manusia sehari-hari.

## **D. 	Ide Solusi**

Solusi yang ditawarkan adalah **"Flood Watcher"**, sebuah platform WebGIS interaktif yang bertindak sebagai pusat informasi mitigasi bencana dan konsultan properti virtual.

Mekanisme kerja utama solusi ini adalah:

1. **Agregasi Data (Scraping & Fetching):** Sistem secara otomatis menarik (fetching) data dari API publik BMKG. Data ini mencakup prakiraan cuaca, titik koordinat curah hujan ekstrem, dan potensi banjir.  
2. **Visualisasi Spasial (WebGIS):** Data yang ditarik kemudian divisualisasikan menggunakan peta interaktif (berbasis Mapbox/Leaflet), di mana rentang daerah dan titik koordinat terdampak banjir direpresentasikan dalam bentuk poligon warna dan *marker*.  
3. **Analisis AI (Gemini Integration):** Platform ini diintegrasikan dengan Gemini API. Pengguna dapat berinteraksi dengan AI *chatbot* di dalam website. Ketika pengguna memasukkan nama sebuah daerah atau mengklik titik di peta, sistem akan mengirimkan data mentah daerah tersebut ke Gemini. Gemini kemudian bertugas **menganalisis dan menyimpulkan** data tersebut menjadi rekomendasi yang mudah dipahami, misalnya: *"Daerah Bekasi Barat blok X saat ini memiliki curah hujan tinggi dan probabilitas banjir 80%. Suhu rata-rata harian cukup panas (33°C). Tidak direkomendasikan untuk membeli rumah berlantai satu di area ini tanpa peninggian fondasi."*

## **E. Target Pengguna**

1. **Masyarakat Umum:** Untuk memantau cuaca harian dan peringatan dini potensi genangan/banjir di jalur aktivitas mereka.  
2. **Calon Pembeli Rumah / Investor Properti:** Sebagai alat *due diligence* (uji tuntas) untuk menilai kelayakan lingkungan sebelum memutuskan membeli properti.  
3. **Pemerintah Tingkat RT/RW atau Komunitas Relawan:** Untuk memantau daerah rawan secara visual dan mempersiapkan langkah preventif.

## **F. Fitur Utama**

1. **Interactive Flood Map (Peta Banjir Interaktif):** Peta yang menampilkan visualisasi daerah rawan banjir (zona merah, kuning, hijau) berdasarkan data *real-time* dan riwayat curah hujan BMKG.  
2. **Location Insights Dashboard:** Panel yang menampilkan informasi detail ketika sebuah titik di peta diklik (Suhu, Kelembapan, Status Siaga).  
3. **AI Property & Environment Consultant:** Fitur *chat* bertenaga Gemini AI. Pengguna bisa bertanya dengan bahasa natural seperti, *"Apakah perumahan di Kemang aman dari banjir 5 tahun ke depan berdasarkan data saat ini?"* atau *"Beri tahu saya kecocokan daerah ini untuk orang yang tidak tahan udara lembab."*  
4. **Smart Search:** Pencarian lokasi spesifik yang langsung memunculkan ringkasan analitik AI mengenai wilayah tersebut.

## **G. Teknologi / AI Tools yang Digunakan**

* **Gemini API:** Sebagai otak analitik (LLM) untuk memproses teks/data JSON cuaca menjadi rekomendasi bahasa natural dan menjalankan sistem *chatbot*.  
* **Cursor / GitHub Copilot:** Digunakan sebagai *AI Coding Assistant* untuk mempercepat pengembangan kode front-end (React.js/HTML/CSS) dan integrasi peta.  
* **Mapbox / Leaflet:** Pustaka JavaScript untuk merender peta interaktif (WebGIS).  
* **Python (BeautifulSoup / Requests):** Untuk melakukan *scraping* atau *fetching* data dari portal API publik BMKG.  
* **Vercel / Netlify:** Untuk keperluan *deployment* (hosting) prototype aplikasi.

## **H. Rencana Prototype**

Prototype akan berbentuk sebuah situs *web dashboard* satu halaman (Single Page Application). Saat situs dibuka, sisi sebelah kiri akan mendominasi layar dengan peta interaktif (WebGIS) yang menampilkan *heat-map* curah hujan dan titik banjir di suatu kota (misal: Jabodetabek). Di sisi kanan, terdapat panel *dashboard* cuaca dan *chat interface* (AI Assistant). Pengguna dapat mengklik sebuah area di peta, dan secara otomatis AI akan memunculkan ringkasan penilaian kelayakan daerah tersebut di panel sebelah kanan.

# **DOKUMENTASI PENGGUNAAN AI**

## **A. AI Tools yang Digunakan**

| Aktivitas | Tools AI | Deskripsi Singkat |
| :---- | :---- | :---- |
| **Brainstorming Ide** | ChatGPT / Claude | Membantu menyusun alur logika bagaimana data BMKG bisa diolah menjadi data properti. |
| **Coding & Debugging** | Cursor / GitHub Copilot | Menulis *boilerplate* untuk integrasi peta Leaflet dan *setup fetching* API ke server BMKG. |
| **Natural Language Processing** | Gemini API | Diimplementasikan di dalam aplikasi untuk berinteraksi langsung dengan pengguna (*End-user facing AI*). |
| **Desain UI/UX** | v0.dev / Canva AI | Membuat *mockup* tata letak *dashboard* WebGIS sebelum proses penulisan kode. |

## **B. Prompt yang Digunakan**

Berikut adalah beberapa *prompt* krusial yang kami gunakan selama proses pengembangan:

**1\. Prompt untuk Cursor (Membuat Peta):**

*"Buatkan komponen React menggunakan react-leaflet. Komponen ini harus bisa menerima sebuah array of objects (data titik banjir dengan latitude, longitude, dan status bahaya). Tampilkan marker di peta, dan jika marker diklik, munculkan popup yang memanggil fungsi handleMarkerClick(id)."*

**2\. Prompt untuk System Instructions Gemini API (Di dalam *source code*):**

*"Anda adalah 'Flood Watcher AI', seorang konsultan properti dan ahli mitigasi bencana. Anda akan diberikan data JSON berisi nama wilayah, suhu, kelembapan, dan tingkat curah hujan dari BMKG. Tugas Anda: Jawab pertanyaan pengguna mengenai kelayakan daerah tersebut untuk dijadikan tempat tinggal. Evaluasi apakah daerah tersebut rawan banjir atau terlalu panas/lembab. Gunakan bahasa yang profesional namun mudah dimengerti orang awam. Jangan mengarang data, selalu rujuk pada data JSON yang diberikan."*

**3\. Prompt untuk ChatGPT (Mengatasi Error Scraping):**

*"Saya mencoba melakukan fetching data cuaca dari API BMKG format XML menggunakan Python, namun saya mendapatkan error CORS saat mencobanya langsung dari frontend React. Bagaimana arsitektur yang benar untuk menyelesaikan masalah ini?"*

## **C. Hasil dari AI**

1. **Dari Cursor:** Menghasilkan puluhan baris kode *frontend* lengkap dengan struktur peta yang siap pakai, sehingga kelompok tidak perlu mempelajari sintaks Leaflet dari nol dan bisa fokus pada logika bisnis.  
2. **Dari Gemini API:** AI berhasil menerjemahkan data mentah (contoh: {"temp": 34, "humidity": 85, "rain": "high"}) menjadi kalimat naratif: *"Berdasarkan data saat ini, wilayah tersebut bersuhu cukup panas (34°C) dengan kelembapan tinggi (85%). Mengingat intensitas hujan yang tinggi, daerah ini berisiko banjir. Jika Anda mencari hunian yang sejuk dan aman dari genangan air, area ini kurang direkomendasikan."*  
3. **Dari ChatGPT (Solusi Error):** AI memberikan solusi arsitektural berupa pembuatan *proxy server* atau *middleware* menggunakan Node.js untuk mem- *bypass* isu CORS saat menarik data XML BMKG.

## **D. Validasi dan Revisi**

Penggunaan AI tidak luput dari kesalahan, sehingga kelompok kami melakukan tahapan validasi yang ketat:

1. **Revisi Parsing Data API:** Saat AI coding assistant memberikan kode untuk melakukan *parsing* XML BMKG, struktur *tag* XML yang diberikan AI ternyata adalah struktur versi lama. Kelompok harus memvalidasi secara manual dengan membuka dokumentasi resmi API BMKG dan merevisi nama *tag* (seperti \<Kecamatan\> menjadi \<area\>) di dalam *script*.  
2. **Mencegah Halusinasi Gemini:** Pada uji coba awal, Gemini terkadang "mengarang" bahwa suatu wilayah pernah banjir parah di tahun 2007 meskipun data tersebut tidak kami sertakan di *prompt*. Revisi dilakukan dengan memperkuat *System Prompt*, menambahkan instruksi: *"HANYA gunakan data cuaca saat ini yang diberikan di prompt. Jika ditanya sejarah, jawab bahwa Anda hanya menganalisis potensi berdasarkan cuaca saat ini."*  
3. **Optimasi UI Peta:** Kode *default* dari AI menampilkan peta yang terlalu kaku dan *marker* berukuran terlalu besar. Kelompok memodifikasi CSS secara manual agar antarmuka lebih interaktif dan responsif (ramah untuk pengguna *mobile*).

## **E. Refleksi Penggunaan AI**

Berdasarkan pengalaman kelompok kami mengerjakan proyek ini, berikut adalah refleksi kami terhadap penggunaan AI:

* **Apa manfaat AI bagi kelompok?** AI bertindak sebagai katalis (mempercepat proses). Kami bisa mewujudkan prototipe WebGIS dan sistem analisis data yang rumit dalam waktu singkat. AI membantu kami menjembatani keterbatasan *skill coding* tingkat lanjut, sehingga kami bisa lebih fokus pada pemecahan masalah inti (analisis wilayah hunian).  
* **Apa keterbatasan AI?** AI tidak bisa memvalidasi akurasi data spasial secara mandiri. AI juga tidak memahami konteks geografi lokal secara akurat kecuali jika diumpankan data secara spesifik. (Contoh: AI tidak tahu kondisi kontur tanah spesifik di gang kecil, kecuali kita menyuplai data topografi tersebut kepadanya).  
* **Apa kesalahan AI terbesar yang ditemukan?**  
  Kesalahan terbesar adalah "Halusinasi Data Historis" dan pemberian solusi arsitektur *frontend* yang mengabaikan protokol keamanan dasar peramban (*CORS issue*), yang sempat membuat sistem macet total sebelum di-*debug* ulang.  
* **Bagaimana kelompok memvalidasi hasil AI?**  
  Kami melakukan validasi teknis dan fungsional. Secara teknis, kami melakukan *testing* kode baris per baris (*debugging*) menggunakan *console* peramban. Secara fungsional, kami melakukan pengujian dengan menginputkan data daerah rumah kami sendiri (yang kami ketahui secara pasti riwayat cuaca/banjirnya), lalu mencocokkannya dengan output yang diberikan oleh Gemini API. Jika analisisnya meleset, kami tahu *prompt* atau data yang diumpankan perlu diperbaiki.