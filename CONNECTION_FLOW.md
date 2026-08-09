# How Your Project Connects to MySQL

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR APPLICATION                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  React Frontend (Port 3001)                                 │
│       │                                                      │
│       │ HTTP Requests                                       │
│       ▼                                                      │
│  Express Server (Port 5000) - server.js                     │
│       │                                                      │
│       │ Uses                                                │
│       ▼                                                      │
│  Database Connection Pool - db.js                           │
│       │                                                      │
│       │ Reads config from                                   │
│       ▼                                                      │
│  Environment Variables - .env                               │
│       │                                                      │
└───────┼──────────────────────────────────────────────────────┘
        │
        │ MySQL Connection
        ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                            │
├─────────────────────────────────────────────────────────────┤
│  Database: krishisetu                                        │
│                                                              │
│  Tables:                                                     │
│    ├─ pest_data                                             │
│    ├─ bhandara_weather                                      │
│    ├─ raigad_weather                                        │
│    └─ ratnagiri_weather                                     │
└─────────────────────────────────────────────────────────────┘
```

## Configuration Chain

```
.env file
  ↓
DB_HOST=localhost
DB_USER=krishisetu_user
DB_PASSWORD=krishisetu_password
DB_NAME=krishisetu
DB_PORT=3306
  ↓
db.js reads these values
  ↓
Creates connection pool
  ↓
server.js imports db.js
  ↓
API endpoints use the pool
  ↓
Frontend calls API endpoints
```

## Data Import Flow

```
Excel/CSV Files
  ↓
import.js script
  ↓
Reads schema.sql
  ↓
Creates tables
  ↓
Parses data files
  ↓
Inserts into MySQL
```

## Example API Call Flow

```
User visits: http://localhost:5000/api/pest-data
  ↓
server.js receives request
  ↓
Executes: db.query('SELECT * FROM pest_data')
  ↓
MySQL returns data
  ↓
server.js sends JSON response
  ↓
Frontend displays data
```
