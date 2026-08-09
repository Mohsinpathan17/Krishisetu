# Database Setup Summary

## Your Project Structure

✅ Database Schema: `schema.sql` (4 tables defined)
✅ Database Connection: `db.js` (connection pool configured)
✅ Import Script: `import.js` (handles Excel & CSV import)
✅ Init Script: `init-db.js` (creates database)
✅ Server: `server.js` (API endpoints configured)
✅ Environment: `.env` (database credentials)

## Data Files Ready to Import

- `pest data.csv` → pest_data table
- `Bhandara.xlsx` → bhandara_weather table
- `Raigad.xlsx` → raigad_weather table
- `Ratnagiri.xlsx` → ratnagiri_weather table

## Setup Commands (Run in Order)

```bash
# 1. Install dependencies
npm install

# 2. Test database connection
npm run test-db

# 3. Create database
npm run init-db

# 4. Import all data
npm run import-data

# 5. Test again to verify
npm run test-db

# 6. Start server
npm run server
```

## API Endpoints Available

- `GET /api/health` - Check database connection
- `GET /api/pest-data` - Get pest data
- `GET /api/bhandara-weather` - Bhandara weather
- `GET /api/raigad-weather` - Raigad weather
- `GET /api/ratnagiri-weather` - Ratnagiri weather

## Need Help?

See detailed guides:
- `QUICK_START.md` - Step-by-step setup
- `DATABASE_SETUP.md` - Complete documentation
