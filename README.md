# FloodWatch Semarang

Platform web untuk memantau cuaca dan risiko banjir di Kota Semarang berbasis data **BMKG**, **WebGIS (Leaflet)**, dan asisten AI **AQUA Assistant** (Gemini).

**Live Demo:** [https://floodwatch-semarang.vercel.app](https://floodwatch-semarang.vercel.app)

## Fitur

- Dashboard dengan AQUA Assistant (chat AI)
- Peta interaktif 10 titik pantau kelurahan Semarang
- Skor risiko banjir: AMAN · WASPADA · SIAGA · BAHAYA
- Alur analisis lokasi: chat → peta → badge risiko → jawaban AI
- Alert Center, Analytics, Riwayat, Pengaturan

## Tech Stack

- Next.js 16 · React 19 · TypeScript
- Leaflet · Zustand · Recharts · Framer Motion
- BMKG API + dataset CSV fallback
- Google Gemini API (AQUA Assistant)

## Menjalankan Lokal

```bash
npm install
cp .env.example .env.local
# Isi GEMINI_API_KEY di .env.local (gratis: https://aistudio.google.com/apikey)
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `GEMINI_API_KEY` | Ya | API key Google Gemini untuk AQUA Assistant |
| `GEMINI_MODEL` | Tidak | Model default: `gemini-2.5-flash` (ada fallback otomatis) |

## Deploy ke Vercel

Proyek sudah dikonfigurasi untuk Vercel. Deploy dari repo GitHub:

1. Import repo [shafwar/FloodWatch-AI-](https://github.com/shafwar/FloodWatch-AI-) di [vercel.com/new](https://vercel.com/new)
2. Tambahkan environment variable `GEMINI_API_KEY`
3. Deploy — domain produksi: **floodwatch-semarang.vercel.app**

Atau via CLI:

```bash
vercel link --project floodwatch
vercel env add GEMINI_API_KEY production
vercel --prod
```

## Tim

**FloodWatch AI** — Naufal Shafi Anwar · Farrel Syadi Ramadhan  
Universitas Diponegoro · AI For Real Impact 2026
