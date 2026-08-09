const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'krishisetu',
    port: process.env.DB_PORT || 3306,
});

// Function to execute SQL query
async function executeQuery(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// Main cleanup function
async function cleanup() {
    try {
        console.log('Starting cleanup process...');

        // Drop old tables
        const tables = ['crop_data', 'cuttak_weather', 'ludhiana_weather', 'maruteru_weather'];

        for (const table of tables) {
            try {
                console.log(`Dropping table: ${table}...`);
                await executeQuery(`DROP TABLE IF EXISTS ${table};`);
                console.log(`✓ Table ${table} dropped successfully.`);
            } catch (error) {
                console.error(`Error dropping table ${table}:`, error.message);
            }
        }

        // Truncate pest_data to clear old records
        try {
            console.log('Clearing old pest_data records...');
            await executeQuery('TRUNCATE TABLE pest_data;');
            console.log('✓ pest_data table cleared successfully.');
        } catch (error) {
            console.error('Error clearing pest_data:', error.message);
        }

        // Show remaining tables
        console.log('\nRemaining tables in database:');
        const results = await executeQuery('SHOW TABLES;');
        console.log(results);

        console.log('\n✅ Cleanup completed successfully!');

        // Close the connection pool
        pool.end((err) => {
            if (err) {
                console.error('Error closing database connection pool:', err);
                process.exit(1);
            } else {
                console.log('Database connection pool closed.');
                process.exit(0);
            }
        });
    } catch (error) {
        console.error('Error during cleanup process:', error);
        pool.end((err) => {
            if (err) {
                console.error('Error closing database connection pool:', err);
            }
        });
        process.exit(1);
    }
}

// Run the cleanup
cleanup();
