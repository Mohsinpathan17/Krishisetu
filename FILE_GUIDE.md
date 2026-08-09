# File Guide - What Each File Does

## Configuration Files

📄 `.env` - Database credentials (username, password, host)
📄 `.env.example` - Template for .env file
📄 `package.json` - Project dependencies and scripts

## Database Files

📄 `schema.sql` - Defines table structure (4 tables)
📄 `db.js` - Creates MySQL connection pool
📄 `init-db.js` - Creates the database
📄 `import.js` - Imports Excel/CSV data into tables
📄 `test-db-connection.js` - Tests database setup

## Data Files

📊 `pest data.csv` - Pest observation data
📊 `Bhandara.xlsx` - Weather data for Bhandara
📊 `Raigad.xlsx` - Weather data for Raigad
📊 `Ratnagiri.xlsx` - Weather data for Ratnagiri

## Server Files

📄 `server.js` - Express API server with endpoints

## Documentation (Created for You)

📖 `DATABASE_SETUP.md` - Complete setup guide
📖 `QUICK_START.md` - Quick start commands
📖 `SETUP_SUMMARY.md` - Overview summary
📖 `CONNECTION_FLOW.md` - Architecture diagram
📖 `CHECKLIST.md` - Setup checklist
📖 `FILE_GUIDE.md` - This file

## How They Work Together

1. `.env` stores credentials
2. `db.js` reads .env and creates connection
3. `init-db.js` creates database
4. `import.js` reads schema.sql and data files
5. `server.js` uses db.js to serve API
6. Frontend calls server.js endpoints
