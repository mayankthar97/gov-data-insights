# Electricity x GDP Insights App

Interactive national dashboard for electricity consumption and GDP correlation using actual MoSPI snapshots.

## What Changed
- Replaced synthetic mock numbers with actual MoSPI-derived national series.
- Removed state map, rankings, and state-detail views.
- App is now national-only because current integrated MoSPI flow here does not include state-wise filters for ENERGY/NAS endpoints used.

## Repository Layout
- `backend/`: Express API (`/v1/summary`, `/v1/metrics`, `/v1/metrics/correlation`)
- `frontend/`: React + Vite dashboard UI
- `api/openapi.yaml`: current API contract
- `docs/`: use case + data model notes

## Local Run

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

## Deploy

### Backend (Render)
1. Create a Render Web Service from this repo.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend (GitHub Pages via docs)
```bash
cd frontend
npm install
VITE_API_BASE_URL=https://<your-render-backend>.onrender.com npm run build

cd ..
rm -rf docs/*
cp -R frontend/dist/* docs/

git add docs
git commit -m "Deploy latest frontend build"
git push
```

## Data Source Notes
- ENERGY dataset: Electricity final consumption and industry consumption (KToE)
- NAS dataset: GDP constant/current and GDP growth rate (base year 2022-23)
- Snapshot date: 2026-03-02
