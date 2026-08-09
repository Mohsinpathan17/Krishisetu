# MySQL Database Setup Guide for Krishisetu

## Prerequisites

1. **Install MySQL Server**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL
   - Make sure MySQL service is running

2. **Verify MySQL Installation**
   ```bash
   mysql --version
   ```

## Step-by-Step Setup

### 1. Start MySQL Service

**Windows (if using standalone MySQL):**
```bash
net start MySQL80
```

**Or if using XAMPP:**
- Open XAMPP Control Panel
- Click "Start" next to MySQL

### 2. Create MySQL User (Optional but Recommended)

Login to MySQL as root:
```bash
mysql -u root -p
```

Create a dedicated user for the project:
```sql
CREATE USER 'krishisetu_user'@'localhost' IDENTIFIED BY 'krishisetu_password';
GRANT ALL PRIVILEGES ON krishisetu.* TO 'krishisetu_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Configure Environment Variables

Your `.env` file is already configured with:
```
DB_HOST=localhost
DB_USER=krishisetu_user
DB_PASSWORD=krishisetu_password
DB_NAME=krishisetu
DB_PORT=3306
```

**Important:** If you're using root user instead, update `.env`:
```
DB_USER=root
DB_PASSWORD=your_root_password
```

### 4. Initialize Database

Run the initialization script to create the database:
```bash
npm run init-db
```

This will:
- Connect to MySQL server
- Create `krishisetu` database if it doesn't exist

### 5. Import Data from Excel and CSV Files

Run the import script to create tables and import data:
```bash
npm run import-data
```

This will:
- Create all tables (pest_data, bhandara_weather, raigad_weather, ratnagiri_weather)
- Import data from:
  - `pest data.csv` → pest_data table
  - `Bhandara.xlsx` → bhandara_weather table
  - `Raigad.xlsx` → raigad_weather table
  - `Ratnagiri.xlsx` → ratnagiri_weather table

### 6. Verify Database Setup

Login to MySQL and check:
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

## Database Schema

### Tables Created:

1. **pest_data** - Agricultural pest observation data
2. **bhandara_weather** - Weather data for Bhandara location
3. **raigad_weather** - Weather data for Raigad location
4. **ratnagiri_weather** - Weather data for Ratnagiri location

## Connecting to Your Project

The database connection is already configured in `db.js` using connection pooling.

### Using in Your Application:

```javascript
const db = require('./db');

// Example query
db.query('SELECT * FROM pest_data LIMIT 10', (err, results) => {
  if (err) {
    console.error('Query error:', err);
    return;
  }
  console.log(results);
});
```

### In Express Routes (server.js):

```javascript
const express = require('express');
const db = require('./db');

app.get('/api/pest-data', (req, res) => {
  db.query('SELECT * FROM pest_data', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
```

## Troubleshooting

### Error: "Access denied for user"
- Check your MySQL username and password in `.env`
- Make sure the user has proper privileges

### Error: "ECONNREFUSED"
- MySQL service is not running
- Start MySQL service using appropriate method for your system

### Error: "Database does not exist"
- Run `npm run init-db` first

### Error: "Table doesn't exist"
- Run `npm run import-data` to create tables and import data

### Error: "Cannot find module 'mysql2'"
- Run `npm install` to install all dependencies

## Quick Start Commands

```bash
# Install dependencies
npm install

# Initialize database
npm run init-db

# Import all data
npm run import-data

# Start the server
npm run server

# Start full application (server + client)
npm run dev
```

## Data Files

- `pest data.csv` - Pest observation data
- `Bhandara.xlsx` - Bhandara weather station data
- `Raigad.xlsx` - Raigad weather station data
- `Ratnagiri.xlsx` - Ratnagiri weather station data

All data will be automatically imported when you run `npm run import-data`.
