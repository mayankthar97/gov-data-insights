# Gov Data Insights MVP

This MVP has 3 user-facing modules:
1. **MoSPI Assistant** (LLM Q&A page)
2. **Inflation Decoder** (CPI-based household impact)
3. **Job Market Simplifier** (PLFS-based job quality view)

## Hosting Decision
- **Backend**: Render Web Service (`backend/`)
- **Frontend**: GitHub Pages (`docs/` published from built `frontend/dist`)

Reason: this keeps deployment simple for a PM workflow and supports a backend needed for LLM/API logic.

## Data Flow (Important)
- App responses are powered by MoSPI datasets extracted using MCP workflow and stored as a backend snapshot.
- LLM page uses that MoSPI snapshot context and can optionally use OpenAI API when `OPENAI_API_KEY` is configured.

## Backend Endpoints
- `GET /health`
- `GET /v1/mvp/home`
- `GET /v1/mvp/source`
- `POST /v1/mvp/ask`
- `GET /v1/mvp/inflation`
- `POST /v1/mvp/inflation/impact`
- `GET /v1/mvp/jobs`
- `GET /v1/mvp/household-stress`

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

## Production Deploy

### 1) Backend on Render
1. Connect repo in Render.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env vars (optional):
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (default `gpt-4.1-mini`)

### 2) Frontend on GitHub Pages
```bash
cd frontend
VITE_API_BASE_URL=https://<your-render-backend>.onrender.com npm run build
cd ..
rm -rf docs/*
cp -R frontend/dist/* docs/
git add docs
git commit -m "Publish latest MVP frontend"
git push
```

## Note for PM Iteration
To refresh official values, update backend snapshot data using MoSPI MCP extraction and redeploy backend.

## MCP-First Operating Model (Current)
1. Extract latest CPI + PLFS values using MoSPI MCP 4-step workflow.
2. Update `backend/src/data/mvpSnapshot.js`.
3. Redeploy backend service on Render.
4. Frontend reads latest API output automatically (same URL).

This keeps the app grounded in MoSPI MCP today, while we can later automate snapshot refresh as a scheduled backend job.
