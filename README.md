# KrishiSetu — Kharif Crop Pest Risk Research Platform

A responsive web interface for research-driven pest outbreak monitoring in Maharashtra. The website connects an Express API to MySQL agricultural records and a separately deployed Python machine-learning inference service.

**Deployment status:** Source is prepared for deployment, but **no public working site has been verified yet**. Prediction results depend on the original Python model server and model assets. Never present the interface as an already validated production prediction system.

## Features
- Responsive research landing page and crop-monitoring information
- Interactive form for district, crop, temperature, humidity, and rainfall
- Prediction requests sent to `POST /api/predict` (no fabricated fallback)
- Searchable district records from `GET /api/pest-data`
- Separate web, database, and ML service availability indicators
- Research context and limitations

## Stack
React 19, Create React App, Express 4, MySQL, Python ML API (separate runtime).

## Develop
```bash
npm ci
npm start
```
The Express service runs with `npm run server`. Copy `.env.example` to a local `.env`, supply a functioning MySQL service, and launch the original Python inference server separately. The existing React development proxy references localhost:5002; align it with the port used by your Express backend.

## Production build
```bash
npm ci
CI=false npm run build
node server.js
```
The Express server serves the React build and API on the same origin. The `CI=false` command is only a local troubleshooting option; the CI pipeline runs a normal strict build.

For environment variables, infrastructure dependencies, and validation steps, see [DEPLOYMENT.md](DEPLOYMENT.md) and [render.yaml](render.yaml).

## Key API endpoints
- `GET /api/health`: web-server liveness
- `GET /api/ready`: MySQL readiness
- `GET /api/ml-health`: prediction-service availability
- `POST /api/predict`: proxy to the original Python model server
- `GET /api/pest-data`: agricultural record retrieval

**Important model integration note:** The example interface submits location, crop, temperature, humidity, and rainfall. The original Python prediction service's accepted schema has not yet been verified from its source; reconcile input fields before using the public prediction form as a validated scientific instrument.

## Research
Pest Outbreak Prediction for Kharif Crops Using Machine Learning (presented at ICRTSET-2026). The model output is research-oriented decision support, not a replacement for agronomist guidance.

Maintainer: [Mohsin Pathan](https://github.com/Mohsinpathan17).
