const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const { promisify } = require('util');
const db = require('./db'); // This is a connection pool

const readFileAsync = promisify(fs.readFile);

// Function to execute SQL query
async function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// Function to create tables if they don't exist
async function createTables() {
    console.log('Creating tables if they do not exist...');

    // Read and execute schema SQL
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    // Split the schema file into individual statements and execute them
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim() !== '');

    for (const statement of statements) {
        if (statement.trim()) {
            await executeQuery(statement.trim());
        }
    }

    console.log('Tables created successfully.');
}

// Function to parse and import CSV file
async function importCSV(filePath, tableName, columnMappings) {
    console.log(`Importing CSV file: ${filePath} into table: ${tableName}`);

    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', async () => {
                console.log(`Parsed ${results.length} rows from ${filePath}`);

                if (results.length === 0) {
                    console.log('No data to import.');
                    resolve();
                    return;
                }

                // Prepare batch insert
                const batchSize = 1000; // Process in batches of 1000

                for (let i = 0; i < results.length; i += batchSize) {
                    const batch = results.slice(i, i + batchSize);

                    // Build the INSERT query dynamically based on column mappings
                    const columns = Object.keys(columnMappings);
                    const placeholders = columns.map(() => '?').join(',');
                    const columnsList = columns.join(',');

                    const query = `INSERT INTO ${tableName} (${columnsList}) VALUES `;

                    const values = [];
                    const valuePlaceholders = [];

                    for (const row of batch) {
                        const rowValues = [];
                        for (const col of columns) {
                            const mappedCol = columnMappings[col];
                            let value = row[mappedCol];

                            // Handle date conversion for date fields
                            if (col.includes('date') || col.includes('Date')) {
                                if (value) {
                                    // Convert date formats as needed
                                    if (typeof value === 'string') {
                                        // Handle DD/MM/YYYY format
                                        if (value.includes('/')) {
                                            const parts = value.split('/');
                                            if (parts.length === 3) {
                                                value = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                                            }
                                        }
                                    }
                                }
                            }

                            // Convert empty strings to null
                            if (value === '') {
                                value = null;
                            }

                            // Convert numeric strings to numbers where appropriate
                            if (typeof value === 'string' && value.trim() !== '') {
                                // Remove commas from numbers (e.g., '1,027.00' -> '1027.00')
                                const cleanedValue = value.replace(/,/g, '');
                                if (!isNaN(cleanedValue)) {
                                    value = parseFloat(cleanedValue);
                                }
                            }

                            rowValues.push(value);
                        }

                        values.push(...rowValues);
                        valuePlaceholders.push(`(${placeholders})`);
                    }

                    if (valuePlaceholders.length > 0) {
                        const fullQuery = query + valuePlaceholders.join(',');
                        try {
                            await executeQuery(fullQuery, values);
                            console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(results.length / batchSize)} into ${tableName}`);
                        } catch (err) {
                            console.error(`Error inserting batch into ${tableName}:`, err);
                            reject(err);
                            return;
                        }
                    }
                }

                console.log(`Successfully imported ${results.length} rows into ${tableName}`);
                resolve();
            })
            .on('error', (err) => {
                console.error(`Error reading CSV file ${filePath}:`, err);
                reject(err);
            });
    });
}

// Function to import Excel file
async function importExcel(filePath, tableName, columnMappings) {
    console.log(`Importing Excel file: ${filePath} into table: ${tableName}`);

    try {
        const workbook = XLSX.readFile(filePath);

        // Find the sheet with actual data (skip metadata rows)
        for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON, starting from the actual data rows
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Find the header row (usually after metadata)
            let headerRowIndex = -1;
            for (let i = 0; i < Math.min(20, jsonData.length); i++) {
                const row = jsonData[i];
                if (row && row.length > 3) { // Likely a header row with multiple columns
                    const nonEmptyCells = row.filter(cell => cell !== null && cell !== undefined && String(cell).trim() !== '');
                    if (nonEmptyCells.length > 3) {
                        headerRowIndex = i;
                        break;
                    }
                }
            }

            if (headerRowIndex === -1) {
                console.log(`Could not find header row in ${filePath}, skipping...`);
                continue;
            }

            // Extract headers
            const headers = jsonData[headerRowIndex];
            console.log(`Found headers in ${filePath}:`, headers);

            // Process data rows starting after header
            const dataRows = [];
            for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (row && row.length > 0) {
                    const obj = {};
                    for (let j = 0; j < headers.length; j++) {
                        if (headers[j]) {
                            obj[headers[j]] = row[j];
                        }
                    }
                    dataRows.push(obj);
                }
            }

            console.log(`Parsed ${dataRows.length} data rows from ${filePath}`);

            if (dataRows.length === 0) {
                console.log('No data to import from Excel file.');
                continue;
            }

            // Prepare batch insert
            const batchSize = 1000;

            for (let i = 0; i < dataRows.length; i += batchSize) {
                const batch = dataRows.slice(i, i + batchSize);

                // Build the INSERT query dynamically based on column mappings
                const columns = Object.keys(columnMappings);
                const placeholders = columns.map(() => '?').join(',');
                const columnsList = columns.join(',');

                const query = `INSERT INTO ${tableName} (${columnsList}) VALUES `;

                const values = [];
                const valuePlaceholders = [];

                for (const row of batch) {
                    const rowValues = [];
                    for (const col of columns) {
                        const mappedCol = columnMappings[col];
                        let value = row[mappedCol];

                        // Handle date conversion for date fields
                        if (col.includes('date') || col.includes('Date')) {
                            if (value) {
                                // Convert Excel date (could be string or number)
                                if (typeof value === 'number') {
                                    // Excel serial date to JS date
                                    const excelDate = new Date((value - 25569) * 86400 * 1000);
                                    value = excelDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                                } else if (typeof value === 'string') {
                                    // Handle DD/MM/YYYY format
                                    if (value.includes('/')) {
                                        const parts = value.split('/');
                                        if (parts.length === 3) {
                                            value = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                                        }
                                    }
                                }
                            }
                        }

                        // Convert time fields
                        if (col.includes('time') || col.includes('Time')) {
                            if (value && typeof value === 'string') {
                                // Convert HH:MM format if needed
                                if (!value.includes(':')) {
                                    // If it's in format like '10:00' but stored differently
                                    if (value.length === 4 && !isNaN(value)) {
                                        value = `${value.substring(0, 2)}:${value.substring(2)}`;
                                    }
                                }
                            }
                        }

                        // Convert empty strings to null
                        if (value === '') {
                            value = null;
                        }

                        // Convert numeric strings to numbers where appropriate
                        if (typeof value === 'string' && value.trim() !== '') {
                            // Remove commas from numbers (e.g., '1,027.00' -> '1027.00')
                            const cleanedValue = value.replace(/,/g, '');
                            if (!isNaN(cleanedValue)) {
                                value = parseFloat(cleanedValue);
                            }
                        }

                        rowValues.push(value);
                    }

                    values.push(...rowValues);
                    valuePlaceholders.push(`(${placeholders})`);
                }

                if (valuePlaceholders.length > 0) {
                    const fullQuery = query + valuePlaceholders.join(',');
                    try {
                        await executeQuery(fullQuery, values);
                        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(dataRows.length / batchSize)} into ${tableName}`);
                    } catch (err) {
                        console.error(`Error inserting batch into ${tableName}:`, err);
                        throw err;
                    }
                }
            }

            console.log(`Successfully imported ${dataRows.length} rows into ${tableName}`);
        }
    } catch (error) {
        console.error(`Error reading Excel file ${filePath}:`, error);
        throw error;
    }
}

// Main import function
async function main() {
    try {
        console.log('Starting database import process...');

        // Create tables first
        await createTables();

        // Import pest data CSV
        await importCSV(
            './pest data.csv',
            'pest_data',
            {
                observation_year: 'observation_year',
                standard_week: 'standard_week',
                pest_value: 'pest_value',
                collection_type: 'collection_type',
                maxt: 'maxt',
                mint: 'mint',
                rh1_percent: 'rh1___',
                rh2_percent: 'rh2___',
                rf_mm: 'rf_mm_',
                ws_kmph: 'ws_kmph_',
                ssh_hrs: 'ssh_hrs_',
                evp_mm: 'evp_mm_',
                pest_name: 'pest_name',
                location: 'location'
            }
        );

        // Import Bhandara weather Excel
        await importExcel(
            './Bhandara.xlsx',
            'bhandara_weather',
            {
                sr_no: 'SR NO',
                date: 'Date',
                time: 'Time',
                wind_speed_ms: 'Wind Speed (m/s)',
                wind_direction_n: 'Wind Direction (°N)',
                atmospheric_pressure_hpa: 'Atmospheric Pressure (hPa)',
                temperature_celsius: 'Temperature (°C)',
                humidity_percent: 'Humidity (%)',
                solar_radiation_wm2: 'Solar Radiation (W/m2)',
                battery_voltage_v: 'Battery Voltage (V)'
            }
        );

        // Import Raigad weather Excel
        await importExcel(
            './Raigad.xlsx',
            'raigad_weather',
            {
                sr_no: 'SR NO',
                date: 'Date',
                time: 'Time',
                wind_speed_ms: 'Wind Speed (m/s)',
                wind_direction_n: 'Wind Direction (°N)',
                atmospheric_pressure_hpa: 'Atmospheric Pressure (hPa)',
                temperature_celsius: 'Temperature (°C)',
                humidity_percent: 'Humidity (%)',
                solar_radiation_wm2: 'Solar Radiation (W/m2)',
                battery_voltage_v: 'Battery Voltage (V)'
            }
        );

        // Import Ratnagiri weather Excel
        await importExcel(
            './Ratnagiri.xlsx',
            'ratnagiri_weather',
            {
                sr_no: 'SR NO',
                date: 'Date',
                time: 'Time',
                wind_speed_ms: 'Wind Speed (m/s)',
                wind_direction_n: 'Wind Direction (°N)',
                atmospheric_pressure_hpa: 'Atmospheric Pressure (hPa)',
                temperature_celsius: 'Temperature (°C)',
                humidity_percent: 'Humidity (%)',
                solar_radiation_wm2: 'Solar Radiation (W/m2)',
                battery_voltage_v: 'Battery Voltage (V)'
            }
        );

        console.log('All data imported successfully!');

        // End the database connection pool
        db.end((err) => {
            if (err) {
                console.error('Error closing database connection pool:', err);
            } else {
                console.log('Database connection pool closed.');
            }
        });
    } catch (error) {
        console.error('Error during import process:', error);

        // End the database connection pool
        db.end((err) => {
            if (err) {
                console.error('Error closing database connection pool:', err);
            } else {
                console.log('Database connection pool closed.');
            }
        });

        process.exit(1);
    }
}

// Run the import process
main();