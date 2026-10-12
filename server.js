const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ML_API_HOST = process.env.ML_API_HOST || '127.0.0.1';
const ML_API_PORT = Number(process.env.ML_API_PORT || 5001);
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001')
  .split(',').map(origin => origin.trim()).filter(Boolean);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '100kb' }));

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, 'build')));

// Import database connection
const db = require('./db');

// Liveness: web process is running. Does not imply DB/ML readiness.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'krishisetu-web', timestamp: new Date().toISOString() });
});

// Readiness: database is reachable. Report failures with a non-200 status.
app.get('/api/ready', async (req, res) => {
  try {
    await db.promise().query('SELECT 1');
    res.json({ status: 'ready', database: 'connected' });
  } catch (error) {
    console.error('Database readiness check failed:', error.message);
    res.status(503).json({ status: 'unavailable', database: 'disconnected' });
  }
});

// API endpoint to get pest data with optional filters
app.get('/api/pest-data', async (req, res) => {
  try {
    let query = 'SELECT * FROM pest_data';
    const params = [];
    
    // Add filters if provided
    const { location, pest_name, year, week } = req.query;
    
    if (location) {
      query += ' WHERE location LIKE ?';
      params.push(`%${location}%`);
    }
    
    if (pest_name) {
      if (params.length > 0) {
        query += ' AND pest_name LIKE ?';
      } else {
        query += ' WHERE pest_name LIKE ?';
      }
      params.push(`%${pest_name}%`);
    }
    
    if (year) {
      if (params.length > 0) {
        query += ' AND observation_year = ?';
      } else {
        query += ' WHERE observation_year = ?';
      }
      params.push(parseInt(year));
    }
    
    if (week) {
      if (params.length > 0) {
        query += ' AND standard_week = ?';
      } else {
        query += ' WHERE standard_week = ?';
      }
      params.push(parseInt(week));
    }
    
    // Add ordering and limit
    query += ' ORDER BY observation_year DESC, standard_week ASC';
    query += ' LIMIT 1000'; // Limit to prevent huge responses
    
    const [rows] = await db.promise().execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pest data:', error);
    res.status(500).json({ error: 'Unable to process the request.' });
  }
});

// API endpoint to get Bhandara weather data with optional filters
app.get('/api/bhandara-weather', async (req, res) => {
  try {
    let query = 'SELECT * FROM bhandara_weather';
    const params = [];
    
    // Add filters if provided
    const { date_from, date_to, sr_no } = req.query;
    
    if (date_from) {
      query += ' WHERE date >= ?';
      params.push(date_from);
    }
    
    if (date_to) {
      if (params.length > 0) {
        query += ' AND date <= ?';
      } else {
        query += ' WHERE date <= ?';
      }
      params.push(date_to);
    }
    
    if (sr_no) {
      if (params.length > 0) {
        query += ' AND sr_no = ?';
      } else {
        query += ' WHERE sr_no = ?';
      }
      params.push(parseInt(sr_no));
    }
    
    // Add ordering and limit
    query += ' ORDER BY date DESC, time DESC';
    query += ' LIMIT 1000'; // Limit to prevent huge responses
    
    const [rows] = await db.promise().execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching Bhandara weather data:', error);
    res.status(500).json({ error: 'Unable to process the request.' });
  }
});

// API endpoint to get Raigad weather data with optional filters
app.get('/api/raigad-weather', async (req, res) => {
  try {
    let query = 'SELECT * FROM raigad_weather';
    const params = [];
    
    // Add filters if provided
    const { date_from, date_to, sr_no } = req.query;
    
    if (date_from) {
      query += ' WHERE date >= ?';
      params.push(date_from);
    }
    
    if (date_to) {
      if (params.length > 0) {
        query += ' AND date <= ?';
      } else {
        query += ' WHERE date <= ?';
      }
      params.push(date_to);
    }
    
    if (sr_no) {
      if (params.length > 0) {
        query += ' AND sr_no = ?';
      } else {
        query += ' WHERE sr_no = ?';
      }
      params.push(parseInt(sr_no));
    }
    
    // Add ordering and limit
    query += ' ORDER BY date DESC, time DESC';
    query += ' LIMIT 1000'; // Limit to prevent huge responses
    
    const [rows] = await db.promise().execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching Raigad weather data:', error);
    res.status(500).json({ error: 'Unable to process the request.' });
  }
});

// API endpoint to get Ratnagiri weather data with optional filters
app.get('/api/ratnagiri-weather', async (req, res) => {
  try {
    let query = 'SELECT * FROM ratnagiri_weather';
    const params = [];
    
    // Add filters if provided
    const { date_from, date_to, sr_no } = req.query;
    
    if (date_from) {
      query += ' WHERE date >= ?';
      params.push(date_from);
    }
    
    if (date_to) {
      if (params.length > 0) {
        query += ' AND date <= ?';
      } else {
        query += ' WHERE date <= ?';
      }
      params.push(date_to);
    }
    
    if (sr_no) {
      if (params.length > 0) {
        query += ' AND sr_no = ?';
      } else {
        query += ' WHERE sr_no = ?';
      }
      params.push(parseInt(sr_no));
    }
    
    // Add ordering and limit
    query += ' ORDER BY date DESC, time DESC';
    query += ' LIMIT 1000'; // Limit to prevent huge responses
    
    const [rows] = await db.promise().execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching Ratnagiri weather data:', error);
    res.status(500).json({ error: 'Unable to process the request.' });
  }
});

// ML API health check
app.get('/api/ml-health', (req, res) => {
  const options = {
    hostname: ML_API_HOST,
    port: ML_API_PORT,
    path: '/health',
    method: 'GET'
  };
  const req2 = http.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', chunk => { data += chunk; });
    proxyRes.on('end', () => {
      try { res.json({ ml_api: 'connected', ...JSON.parse(data) }); }
      catch { res.json({ ml_api: 'connected' }); }
    });
  });
  req2.on('error', () => res.status(503).json({ ml_api: 'offline', message: 'Prediction service unavailable' }));
  req2.setTimeout(10000, () => req2.destroy(new Error('ML service timeout')));
  req2.end();
});

// Proxy endpoint to Python ML API for pest prediction
app.post('/api/predict', async (req, res) => {
  try {
    const postData = JSON.stringify(req.body);
    const options = {
      hostname: ML_API_HOST,
    port: ML_API_PORT,
      path: '/predict',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', (chunk) => { data += chunk; });
      proxyRes.on('end', () => {
        try {
          res.status(proxyRes.statusCode || 502).json(JSON.parse(data));
        } catch (e) {
          res.status(502).json({ error: 'Invalid response from ML service' });
        }
      });
    });

    proxyReq.on('error', () => {
      res.status(503).json({ error: 'ML prediction service unavailable.' });
    });

    proxyReq.setTimeout(15000, () => proxyReq.destroy(new Error('ML service timeout')));
    proxyReq.write(postData);
    proxyReq.end();
  } catch (error) {
    res.status(500).json({ error: 'Unable to process the request.' });
  }
});

// Catch-all handler for any requests that don't match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});