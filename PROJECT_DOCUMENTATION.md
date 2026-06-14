# Project Documentation & PRD: FloodWatch Semarang

## 1. Pendahuluan (Introduction)
**Nama Proyek:** FloodWatch Semarang  
**Deskripsi Singkat:** 
Sebuah dasbor IoT interaktif berbasis web (menggunakan ekosistem Next.js) yang dirancang untuk memantau kondisi cuaca dan memprediksi risiko banjir di berbagai wilayah (kelurahan) di Semarang. Aplikasi ini menyajikan data secara *real-time* dengan memadukan basis data historis asli dari BMKG dengan simulasi fluktuasi cuaca untuk keperluan presentasi dan analisis yang realistis.

## 2. Arsitektur Data (Data Architecture)
Pembaruan terbaru pada sistem telah memigrasikan aplikasi dari penggunaan *mock data* statis menjadi sepenuhnya digerakkan oleh **Dataset Cuaca Asli BMKG** yang disimpan secara lokal.

- **Sumber Data Asli:** File CSV lokal (`dataset/histori_cuaca_semarang.csv`).
- **API Internal (`/api/weather`):** Jalur API (server-side) lokal yang di-build untuk membaca, mem-*parsing*, dan mengonversi baris-baris pada CSV tersebut menjadi objek JSON yang mudah dikonsumsi aplikasi (*WeatherRecords*).
- **Safe Mode (Anti-Blokir):** Pendekatan membaca data CSV lokal secara internal ini memastikan aplikasi sepenuhnya kebal dari hambatan jaringan atau pemblokiran bot (seperti Cloudflare BMKG), serta dapat berjalan lancar *offline* selama demo atau presentasi.

## 3. Manajemen State & Simulasi (State & Simulation)
Aplikasi didesain agar terus "hidup" seperti dasbor pemantauan IoT sesungguhnya, tanpa membebani server eksternal.

- **Global State (`store/weatherStore.ts`):** 
  Menggunakan **Zustand**. *Store* utama bertugas mengambil data awal dengan melakukan *HTTP Fetch* ke `/api/weather` pada saat website pertama kali dimuat.
- **Real-time Engine (`hooks/useRealtime.ts`):** 
  Untuk memberikan kesan dinamis, sistem menyuntikkan efek fluktuasi data. 
  - **Mekanisme:** Berjalan setiap 30 detik (default), simulasi akan memilih 2-3 lokasi secara acak untuk diperbarui.
  - **Logika Fluktuasi:** Sistem mengambil data *baseline* dari CSV, lalu memberikan deviasi ringan. Suhu dimodifikasi ±1°C dan kelembapan ±3%. Kondisi cuaca berubah secara logis berdasarkan *Transition Matrix* (contoh: 'Cerah' bisa bergeser bertahap ke 'Cerah Berawan', dan tidak akan langsung loncat ke 'Hujan Lebat').
  - **Sistem Peringatan Terotomatisasi (Alerts):** Jika kombinasi cuaca dan kelembapan dari simulasi ini menembus batas risiko (skor >= 40), peringatan (*alert*) banjir akan ter-*generate* dan di-*push* ke dasbor.

## 4. Komponen Visual & UI (User Interface)
- **Dasbor Utama & KPI:** Komponen seperti `KPICard.tsx` dan `DashboardMiniMap.tsx` telah disinkronisasikan. Data lokasi, suhu, dan kelembapan di antarmuka cocok *plek* dengan barisan angka pada CSV.
- **Panel Prediksi & Riwayat (`ForecastPanel.tsx`, `HistoryPageClient.tsx`):** Komponen disesuaikan untuk membaca struktur rentang waktu data yang ada pada CSV, khususnya "Saat Ini" dan "3 Jam Kedepan".
- **Sistem Pemetaan Terintegrasi:** Peta menggunakan algoritma GIS yang akan menyorot dan mewarnai wilayah kelurahan berdasarkan data skor kerawanan banjir BMKG terbaru.

## 5. Panduan untuk AI / Agent Selanjutnya (Guidelines for Future Agents)
Dokumen ini mutlak berfungsi sebagai PRD dan Panduan Arsitektur bagi agent AI (Antigravity, Cursor, dsb.) maupun *developer* yang akan melanjutkan proyek.

**Instruksi Penting (DOs & DON'Ts):**
1. **JANGAN MERUSAK STRUKTUR CSV:** Jangan mengubah struktur *header* atau menghapus kolom dari `dataset/histori_cuaca_semarang.csv`. API bergantung erat pada format `Daerah,Keterangan,Waktu,Kondisi,Suhu_C,Kelembapan_%`.
2. **PERTAHANKAN LOCAL API:** Tetap pertahankan dan gunakan endpoint `/api/weather`. Jika ingin menambah integrasi API cuaca eksternal di kemudian hari, jadikan `/api/weather` sebagai *middleman* atau agregator untuk menghindari *CORS* dan *Rate-Limiting*.
3. **PENGEMBANGAN FITUR:**
   - **Simulasi Waktu:** Jika butuh simulasi yang lebih cepat, ubah *value* parameter `intervalSeconds` pada `useRealtime.ts`.
   - **Data Lokasi:** Untuk menambah lokasi pantauan baru, tambahkan terlebih dahulu ke file `lib/locations.ts` DAN masukkan data baris terkait ke file CSV. Keduanya harus tersinkronisasi.
   - **Algoritma Risiko:** Perhitungan skor risiko dan generasi *alerts* berada di `lib/floodRiskEngine.ts`. Lakukan penyesuaian bobot cuaca di sana jika diperlukan.

## 6. Status Proyek
Dengan selesainya integrasi *dataset*, aplikasi ini sudah mencapai tahap **Production-Ready / Presentation-Ready Dashboard**. Keseluruhan logika simulasi dinamis, visualisasi peta GIS, dan integrasi historis BMKG telah berjalan harmonis.
