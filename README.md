# Nearby Places Explorer

Google Places API kullanan Spring Boot + React uygulaması.

## Teknolojiler
- Backend: Spring Boot 3.2.4 (Java 17+, port 8070)
- Frontend: React 18
- Deploy: Cloud Run + Firebase Hosting

## Dizinler
- `backend/`
- `frontend/`

## Gereksinimler
- Java 17+
- Maven veya mvnd
- Node.js 18+
- `gcloud` CLI
- `firebase` CLI

## Ortam Değişkenleri

### Backend
- `GOOGLE_API_KEY`
- `CORS_ALLOWED_ORIGIN`

### Frontend (`frontend/.env`)
```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_BROWSER_KEY
REACT_APP_API_BASE_URL=http://localhost:8070
```

## Lokal Çalıştırma

### Backend
```bash
cd backend
# Linux/Mac
export GOOGLE_API_KEY=YOUR_SERVER_KEY
# Windows PowerShell
# $env:GOOGLE_API_KEY="YOUR_SERVER_KEY"
mvn spring-boot:run
```

Test:
- `http://localhost:8070/api/nearby?latitude=41.0082&longitude=28.9784&radius=1000`

### Frontend
```bash
cd frontend
npm install
npm start
```

## API

`GET /api/nearby`

Parametreler:
- `latitude` (double)
- `longitude` (double)
- `radius` (int, max 50000)

## Deploy

### Backend (Cloud Run)
```bash
gcloud auth login
gcloud config set project <PROJECT_ID>

cd backend
gcloud run deploy places-api \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8070 \
  --set-env-vars GOOGLE_API_KEY=<SERVER_KEY>,CORS_ALLOWED_ORIGIN=<FRONTEND_URL>
```

Not: Backend kök URL (`/`) 404 dönebilir, normaldir. Kontrol için `/api/nearby` kullanın.

### Frontend (Firebase Hosting)
```bash
cd frontend
npm install
npm run build
firebase login
firebase deploy --only hosting --project <PROJECT_ID>
```

## Canlı Linkler
- Frontend: `https://annular-climate-479621-b1.web.app`
- Backend: `https://places-api-836010176582.europe-west1.run.app`
- Backend test: `https://places-api-836010176582.europe-west1.run.app/api/nearby?latitude=41.0082&longitude=28.9784&radius=500`
