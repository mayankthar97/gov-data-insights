# Electricity x GDP Insights App

Interactive web app to explore electricity consumption, per-capita usage, and GDP correlation with state-level rankings and drill-down.

## Repository Layout
- `backend/`: Express API implementing `/v1/metrics`, `/v1/map`, `/v1/rankings`, `/v1/state/:stateCode`, `/v1/metrics/correlation`
- `frontend/`: React + Vite dashboard UI
- `api/openapi.yaml`: API contract
- `docs/`: use case + data model

## Local Run

### 1) Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:8080`.

### 2) Frontend
```bash
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```
Frontend runs on `http://localhost:5173`.

## Deploy

### Backend (Render)
1. Push this repo to GitHub.
2. In Render, create a new Web Service from the repo.
3. Set root directory to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Deploy and copy backend URL (example: `https://your-api.onrender.com`).

### Frontend (GitHub Pages)
1. In GitHub repo settings, enable Pages with "GitHub Actions" source.
2. In GitHub repo `Settings -> Secrets and variables -> Actions -> Variables`, add:
   - `VITE_API_BASE_URL=https://your-api.onrender.com`
3. Push to `main` branch.
4. Workflow `Frontend Deploy (GitHub Pages)` will publish `frontend/dist`.

## Data Notes
- Current backend uses mock data shaped to your API contract.
- Replace mock loaders in `backend/src/data/mockData.js` with MoSPI MCP ingestion and external state datasets for production.
