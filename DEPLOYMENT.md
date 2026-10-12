# KrishiSetu — production deployment checklist

**Status:** Deployment preparation, not a live release. Do not share a public URL as a working pest-prediction service until the checks below pass.

## Existing architecture (verified in this repository)

- React (Create React App) user interface.
- Express API in `server.js` (port from `PORT`, otherwise 5000). Express already serves `build/`.
- MySQL database configured from `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT`.
- Express `POST /api/predict` proxies requests to a separate Python prediction server at `127.0.0.1:5001`.
- Current Express CORS allowlist only has localhost:3000 and localhost:3001. Adjust this for your trusted production origin if deploying frontend separately.
- `/api/health` currently responds with HTTP 200 even when the database is disconnected; do not treat that alone as a deployment-readiness check.

## Recommended initial deployment: one Node web service + MySQL + separately running Python ML API

1. **Verify the missing runtime inputs locally.** Confirm the exact Python ML service file, dependencies, trained model assets and startup command. The Node API references `Pest project/ml_api.py`, but the current public repository does not expose that path through the repository file API. If these files are not committed, supply them privately without committing credentials.
2. **Check the web app.** Run `npm ci && npm run build`. Resolve build errors before attempting hosting. Do not assume compilation succeeds just because Create React App was initialized.
3. **Set up a managed MySQL instance.** Load the required table schema and authorized non-sensitive data. Configure `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` in hosting environment variables. Do not commit `.env`.
4. **Deploy Python inference service.** Ensure it uses the trained model actually used in the research, exposes `GET /health` and `POST /predict`, and is reachable by the Express server over a private connection. Confirm its model dependencies fit hosting memory/storage limits.
5. **Remove the hardcoded ML host/port before separating services.** In `server.js`, the prediction and ML health proxy both currently target localhost:5001. Make their destination configurable, for example `ML_API_HOST` and `ML_API_PORT`; add TLS/authentication if traffic goes between public hosts. Do not expose prediction endpoints without appropriate input validation and rate limiting.
6. **Deploy the Node application.** On a Node-capable host, use repository root, build command `npm ci && npm run build`, and start command `node server.js`. The Express service serves the compiled frontend and same-origin `/api/*` routes. Ensure the host injects `PORT` and that the server binds appropriately.
7. **Verify public behavior:** homepage, navigation, assets, data loading, DB-backed filters, `GET /api/ml-health`, valid/invalid prediction requests, responsive mobile UI, correct error messages, no exposed secrets, and HTTPS.

### Simpler portfolio demonstration (not full functionality)

You may deploy just the React build to a static host, but MySQL-backed screens and predictions will not work until proper APIs are connected. Label such a release clearly as a **frontend demo**. Do not display fabricated predictions as real model output.

### Provider guidance

[Render web services](https://render.com/docs/web-services) support Express and Python deployments. Their [multi-service guidance](https://render.com/docs/multi-service-architecture) explains how services communicate. Check your provider's current pricing and database offerings before choosing it; the existing app uses **MySQL**, not PostgreSQL.

### Release checklist

- [ ] Frontend production build succeeds
- [ ] Python ML source and model assets confirmed
- [ ] Hosted MySQL schema and sample queries validated
- [ ] Production API environment variables configured
- [ ] CORS and proxy settings updated
- [ ] Real inference returns valid outputs
- [ ] Broken/invalid inputs handled safely
- [ ] Domain HTTPS and mobile UI checked
- [ ] README updated with **verified** live URL

**Scientific caution:** The model's predictions should be labelled as research/decision-support estimates, not guaranteed agricultural outcomes.
