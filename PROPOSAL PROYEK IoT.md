## **PROPOSAL PROYEK IoT** 

**AQUA-SENSE: Sistem Peringatan Dini Banjir Prediktif Berbasis IoT, Integrasi API Cuaca BMKG, dan Pemetaan Spasial (WebGIS)** . 

## **Disusun untuk Memenuhi Tugas Proyek** 

## **pada Internet of Things Semester Delapan** 

Disusun oleh: 

Naufal Shafi Anwar (24060122140185) Farrel Syadi Ramadhan (24060122140181) Ahmad Danun Hanani (24060121130059) 

## **DEPARTEMEN INFORMATIKA** 

## **FAKULTAS SAINS DAN MATEMATIKA** 

## **UNIVERSITAS DIPONEGORO** 

## **SEMARANG** 

**2026** 

## **BAB 1** 

## **PENDAHULUAN** 

## **1.1 Latar Belakang** 

Banjir merupakan salah satu ancaman konstan di kawasan perkotaan dengan curah hujan tinggi dan topografi yang kompleks, seperti Kota Semarang. Kerugian akibat banjir, baik secara material maupun kelumpuhan aktivitas ekonomi, seringkali terjadi karena keterlambatan informasi. Masyarakat dan pihak berwenang umumnya baru bereaksi ketika genangan air telah meluap dari saluran drainase atau sungai. Sistem penanggulangan yang ada saat ini mayoritas masih bersifat _reaktif_ , mengandalkan pantauan visual manual atau sensor pasif yang hanya memberikan peringatan saat air sudah berada di titik kritis. 

Paradigma _Smart City_ menuntut transisi dari pendekatan reaktif menuju _proaktif_ dan _prediktif_ . Proyek **AQUA-SENSE** hadir untuk menjembatani celah tersebut. AQUA-SENSE adalah sebuah inovasi Sistem Peringatan Dini (Early Warning System) yang menggabungkan kemampuan pemantauan kondisi lingkungan mikro secara langsung ( _real-time_ via sensor IoT) dengan analisis kondisi cuaca makro regional (melalui integrasi API Publik BMKG). Dengan memanfaatkan analitik data dan _Machine Learning_ , AQUA-SENSE tidak hanya memberikan laporan status saat ini, tetapi juga memprediksi potensi luapan air _sebelum_ banjir benar-benar terjadi, serta memvisualisasikannya melalui peta interaktif ( _WebGIS_ ). 

## **1.2 Rumusan Masalah** 

Berdasarkan latar belakang tersebut, inovasi AQUA-SENSE dirancang untuk menjawab permasalahan berikut: 

1. Bagaimana mengintegrasikan perangkat keras IoT (sensor curah hujan, ultrasonik, dan kelembapan) untuk mengakuisisi data kondisi saluran air secara _real-time_ ? 

2. Bagaimana membangun arsitektur perangkat lunak ( _backend_ ) yang mampu memadukan data sensor lokal dengan data prakiraan cuaca eksternal (API BMKG) untuk menghasilkan analisis prediktif? 

3. Bagaimana menyajikan data analisis yang kompleks tersebut ke dalam sebuah _dashboard_ berbasis _web_ dan _map_ interaktif yang intuitif bagi masyarakat dan pengambil kebijakan? 

## **1.3 Tujuan Inovasi** 

1. Merancang dan mengimplementasikan _node_ sensor cerdas berbasis IoT yang hemat daya dan andal untuk memantau ketinggian air dan curah hujan lokal. 

2. Membangun sistem _backend_ berbasis _Machine Learning_ yang mampu mengkalkulasi tingkat signifikansi faktor cuaca (curah hujan lokal dan prediksi cuaca) terhadap tren kenaikan air genangan. 

3. Mengembangkan _platform_ visualisasi berupa _dashboard_ pemantauan terpusat yang dilengkapi dengan sistem peringatan dini otomatis dan peta persebaran potensi bencana spasial. 

## **1.4 Manfaat Inovasi** 

- **Bagi Masyarakat:** Memberikan _golden time_ (waktu evakuasi) yang lebih panjang melalui peringatan dini yang akurat sebelum air meluap. 

- **Bagi Pemerintah (BPBD/Pemkot):** Menjadi Sistem Pendukung Keputusan (SPK) dalam mengalokasikan sumber daya tanggap darurat (seperti pengaktifan pompa air sentral) secara tepat sasaran berdasarkan pemetaan prediktif. 

## **BAB 2** 

## **TINJAUAN TEKNOLOGI DAN ARSITEKTUR SISTEM** 

Sistem AQUA-SENSE dibangun secara berlapis ( _multi-layer architecture_ ) yang menjamin skalabilitas dan keandalan data. 

## **2.1 Perception Layer (Perangkat Keras IoT)** 

Lapisan ini bertugas melakukan akuisisi data di lapangan ( _edge computing_ ). Setiap _node_ (titik pantau) akan ditenagai oleh mikrokontroler (ESP32/ESP8266) yang terhubung dengan modul sensor: 

- **Sensor Ketinggian Air (Ultrasonik - JSN-SR04T):** Sensor _waterproof_ yang mengukur jarak permukaan air ke bibir sungai/drainase untuk menentukan persentase kapasitas saluran ( _Water Level_ ). 

- **Sensor Curah Hujan (Tipping Bucket / Raindrop):** Mengukur intensitas presipitasi curah hujan lokal di titik pantau. 

- **Sensor Lingkungan (SHT/DHT):** Memantau suhu dan kelembapan ( _humidity_ ) sekitar untuk melihat korelasi tingkat kejenuhan udara terhadap curah hujan. 

## **2.2 Network & Processing Layer (Integrasi Data & Machine Learning)** 

Data _real-time_ dari _node_ IoT dikirim ke server _cloud_ melalui protokol MQTT/HTTP. Pada lapisan ini, terdapat mesin analitik ( _backend_ ) berbasis Python yang menjalankan dua tugas utama: 

1. **Data Ingestion (API BMKG):** Server menggunakan fungsi penjadwalan ( _scheduler_ ) untuk secara berkala mengambil data prakiraan cuaca tingkat kelurahan (adm4) melalui API Publik BMKG (Prakiraan waktu: 1 jam sebelum, saat ini, dan 1 jam ke depan). 

2. **Machine Learning & Data Fusion:** Algoritma prediksi akan memproses data bivariat. Data historis dari sensor akan dianalisis untuk menemukan seberapa signifikan korelasi antara curah hujan ( _variabel independen_ ) dengan lonjakan ketinggian air ( _variabel dependen_ ). Model prediksi ini kemudian digabungkan dengan prakiraan BMKG. _Logika cerdas:_ Jika ketinggian air saat ini berada pada batas "Waspada", dan API BMKG serta sensor lokal mendeteksi hujan lebat akan berlanjut, sistem akan secara otonom menaikkan status menjadi "Awas" dan memicu peringatan, meskipun batas fisik maksimal belum tersentuh. 

## **2.3 Application Layer (Web Dashboard & WebGIS)** 

Lapisan interaksi pengguna yang menampilkan _insight_ dari pengolahan data. Fitur utamanya meliputi: 

- **Dashboard Grafik Korelatif:** Visualisasi grafik garis ( _line chart_ ) interaktif yang menumpuk tren kenaikan air nyata dengan intensitas curah hujan, sehingga pengguna dapat melihat korelasi dampak cuaca secara visual. 

- **WebGIS / Predictive Mapping:** Visualisasi menggunakan komponen peta interaktif (Mapbox/Leaflet.js). Peta ini memvisualisasikan titik ( _node_ ) IoT di seluruh kota. Titik rawan akan ditandai dengan gradasi warna peringatan (hijau, kuning, merah) yang berkedip jika sistem prediktif memproyeksikan potensi luapan. 

- **Notification Gateway:** Integrasi bot (misalnya Telegram API) yang secara otomatis menembakkan pesan peringatan dini ( _alert_ ) ke grup siaga bencana warga ketika ambang batas prediktif terlampaui. 

## **BAB 3** 

## **METODE PELAKSANAAN** 

Pelaksanaan pengembangan inovasi AQUA-SENSE dibagi ke dalam beberapa tahapan komprehensif: 

1. **Tahap Riset dan Akuisisi Komponen:** Pemilihan _hardware_ tahan cuaca dan perumusan topologi jaringan untuk komunikasi data _node_ IoT. 

2. **Tahap Perakitan Hardware & Firmware:** Pemrograman mikrokontroler untuk pembacaan sensor dan kalibrasi akurasi sensor ultrasonik terhadap objek air bergerak. 

3. **Tahap Pengembangan Software & Model ML (Fokus Pengolahan Data):** 

   - Pengembangan _script backend_ (menggunakan Python/Pandas) untuk ekstraksi dan normalisasi respons format JSON dari API BMKG secara terus-menerus. 

   - Pembuatan struktur _database_ (misal MySQL/Firebase) untuk menyimpan data _time-series_ . 

   - Pelatihan dan pengujian algoritma _Thresholding Dinamis_ berdasarkan pembobotan data cuaca. 

4. **Tahap Desain Frontend (UI/UX):** Merancang _mockup_ antarmuka dan mengembangkan integrasi _Web Map_ untuk visualisasi titik rawan genangan air. 

5. **Tahap Integrasi dan Pengujian (System Testing):** Pengujian _end-to-end_ (E2E), menyimulasikan curah hujan pada alat uji dan memastikan keterlambatan pengiriman data ( _latency_ ) ke _dashboard_ berada dalam batas toleransi. 

## **BAB 4** 

## **KESIMPULAN** 

AQUA-SENSE menawarkan loncatan inovasi dalam mitigasi bencana perkotaan. Proyek ini tidak sekadar merekam data banjir, melainkan bertransformasi menjadi **Sistem Cerdas (AI-Powered System)** . Dengan menggabungkan validitas data makro dari API BMKG, akurasi sensor lokal IoT, analisis korelasi data, serta pemetaan _WebGIS_ yang intuitif, AQUA-SENSE mewujudkan implementasi _Smart City_ yang adaptif. Inovasi ini diyakini mampu meningkatkan resiliensi masyarakat terhadap bencana banjir secara terukur, proaktif, dan komprehensif. 

