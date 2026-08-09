# Quick Start Guide - Krishisetu Database Setup

## Step 1: Install MySQL

Make sure MySQL is installed and running on your system.

**Check if MySQL is running:**
```bash
mysql --version
```

## Step 2: Configure Database Credentials

Your `.env` file is already set up with:
```
DB_USER=krishisetu_user
DB_PASSWORD=krishisetu_password
DB_NAME=krishisetu
```

**If using root user**, update `.env`:
```
DB_USER=root
DB_PASSWORD=your_mysql_root_password
```

## Step 3: Create MySQL User (if needed)

If you want to use the dedicated user `krishisetu_user`, run:

```bash
mysql -u root -p
```

Then execute:
```sql
CREATE USER 'krishisetu_user'@'localhost' IDENTIFIED BY 'krishisetu_password';
GRANT ALL PRIVILEGES ON *.* TO 'krishisetu_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 4: Run Setup Commands

```bash
# Install all dependencies
npm install

# Create the database
npm run init-db

# Create tables and import all data
npm run import-data
```

## Step 5: Verify Setup

```bash
mysql -u krishisetu_user -p
```

```sql
USE krishisetu;
SHOW TABLES;
SELECT COUNT(*) FROM pest_data;
SELECT COUNT(*) FROM bhandara_weather;
SELECT COUNT(*) FROM raigad_weather;
SELECT COUNT(*) FROM ratnagiri_weather;
```

## Step 6: Start Your Application

```bash
# Start backend server only
npm run server

# Or start both frontend and backend
npm run dev
```

## Test API Endpoints

Once server is running, test these URLs in your browser:

- Health check: http://localhost:5000/api/health
- Pest data: http://localhost:5000/api/pest-data
- Bhandara weather: http://localhost:5000/api/bhandara-weather
- Raigad weather: http://localhost:5000/api/raigad-weather
- Ratnagiri weather: http://localhost:5000/api/ratnagiri-weather

## Available API Endpoints

### 1. Health Check
```
GET /api/health
```

### 2. Pest Data
```
GET /api/pest-data
GET /api/pest-data?location=Mumbai
GET /api/pest-data?pest_name=aphid
GET /api/pest-data?year=2023
GET /api/pest-data?week=25
```

### 3. Weather Data (Bhandara, Raigad, Ratnagiri)
```
GET /api/bhandara-weather
GET /api/bhandara-weather?date_from=2023-01-01
GET /api/bhandara-weather?date_to=2023-12-31
GET /api/bhandara-weather?date_from=2023-01-01&date_to=2023-12-31

GET /api/raigad-weather
GET /api/ratnagiri-weather
```

## Troubleshooting

### MySQL not running
```bash
# Windows
net start MySQL80

# Or start XAMPP MySQL from control panel
```

### Access denied error
- Check username/password in `.env`
- Make sure user has proper privileges

### Cannot find module errors
```bash
npm install
```

### Database doesn't exist
```bash
npm run init-db
```

### Tables don't exist
```bash
npm run import-data
```
