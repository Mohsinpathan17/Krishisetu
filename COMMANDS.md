# Command Reference

## Setup Commands

```bash
# Install all dependencies
npm install

# Test database connection
npm run test-db

# Create database
npm run init-db

# Import all data from Excel/CSV
npm run import-data
```

## Run Commands

```bash
# Start backend server only (port 5000)
npm run server

# Start frontend only (port 3001)
npm run client

# Start both frontend and backend
npm run dev
```

## MySQL Commands

```bash
# Login to MySQL
mysql -u krishisetu_user -p

# Login as root
mysql -u root -p
```

## MySQL Queries (After Login)

```sql
-- Show all databases
SHOW DATABASES;

-- Use your database
USE krishisetu;

-- Show all tables
SHOW TABLES;

-- Count records in each table
SELECT COUNT(*) FROM pest_data;
SELECT COUNT(*) FROM bhandara_weather;
SELECT COUNT(*) FROM raigad_weather;
SELECT COUNT(*) FROM ratnagiri_weather;

-- View sample data
SELECT * FROM pest_data LIMIT 5;
SELECT * FROM bhandara_weather LIMIT 5;
```

## API Testing URLs

```
http://localhost:5000/api/health
http://localhost:5000/api/pest-data
http://localhost:5000/api/bhandara-weather
http://localhost:5000/api/raigad-weather
http://localhost:5000/api/ratnagiri-weather
```

## Quick Setup (Copy-Paste)

```bash
npm install && npm run init-db && npm run import-data && npm run test-db
```
