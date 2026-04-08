# Nearby Places Explorer

Full-stack application to find nearby places using Google Places API.

## Architecture

```
frontend/   → React.js (port 3000)
backend/    → Spring Boot Java 17 (port 8070)
```

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.8+
- Google API Key with **Places API** and **Maps JavaScript API** enabled

### Backend

```bash
cd backend
export GOOGLE_API_KEY=your_key_here          # Linux/Mac
# set GOOGLE_API_KEY=your_key_here           # Windows CMD
mvn spring-boot:run
```

API available at: `http://localhost:8070/api/nearby?latitude=41.0082&longitude=28.9784&radius=1000`

H2 Console (dev): `http://localhost:8070/h2-console`

### Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env and add your API keys
npm install
npm start
```

App available at: `http://localhost:3000`

## API Reference

### GET /api/nearby

| Parameter  | Type   | Description                        |
|------------|--------|------------------------------------|
| latitude   | double | Latitude of center point           |
| longitude  | double | Longitude of center point          |
| radius     | int    | Search radius in meters (max 50000)|

**Example:**
```
GET http://localhost:8070/api/nearby?latitude=41.0082&longitude=28.9784&radius=1000
```

## Caching

Responses are cached in H2 database (file-based, persists between restarts).  
Same `latitude + longitude + radius` combination returns cached result instantly.

## Deployment

- Backend: Deploy JAR to any Java host (Railway, Render, AWS EC2)  
- Frontend: `npm run build` → deploy to Vercel / Netlify / GitHub Pages
