const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing MySQL Database Connection...\n');
  
  try {
    // Test 1: Connect to MySQL server
    console.log('1️⃣ Connecting to MySQL server...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });
    console.log('✅ Connected to MySQL server successfully!\n');

    // Test 2: Check if database exists
    console.log('2️⃣ Checking if database exists...');
    const [databases] = await connection.query(
      `SHOW DATABASES LIKE '${process.env.DB_NAME || 'krishisetu'}'`
    );
    
    if (databases.length === 0) {
      console.log('❌ Database does not exist!');
      console.log('💡 Run: npm run init-db\n');
      await connection.end();
      return;
    }
    console.log(`✅ Database '${process.env.DB_NAME || 'krishisetu'}' exists!\n`);

    // Test 3: Connect to the database
    console.log('3️⃣ Connecting to database...');
    await connection.query(`USE \`${process.env.DB_NAME || 'krishisetu'}\``);
    console.log('✅ Connected to database successfully!\n');

    // Test 4: Check tables
    console.log('4️⃣ Checking tables...');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('❌ No tables found!');
      console.log('💡 Run: npm run import-data\n');
      await connection.end();
      return;
    }
    
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
    console.log('');

    // Test 5: Check data in each table
    console.log('5️⃣ Checking data in tables...\n');
    
    const tablesToCheck = ['pest_data', 'bhandara_weather', 'raigad_weather', 'ratnagiri_weather'];
    
    for (const tableName of tablesToCheck) {
      try {
        const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const count = rows[0].count;
        
        if (count > 0) {
          console.log(`✅ ${tableName}: ${count} rows`);
        } else {
          console.log(`⚠️  ${tableName}: 0 rows (empty)`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: Table not found`);
      }
    }

    console.log('\n6️⃣ Sample data from pest_data:');
    const [sampleData] = await connection.query('SELECT * FROM pest_data LIMIT 3');
    if (sampleData.length > 0) {
      console.log('✅ Sample records:');
      sampleData.forEach((row, index) => {
        console.log(`   Record ${index + 1}:`, {
          location: row.location,
          pest_name: row.pest_name,
          year: row.observation_year,
          week: row.standard_week
        });
      });
    }

    await connection.end();
    
    console.log('\n🎉 All tests passed! Database is ready to use.');
    console.log('💡 Start your server with: npm run server');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 MySQL server is not running. Please start MySQL:');
      console.log('   - Windows: net start MySQL80');
      console.log('   - Or start XAMPP/WAMP MySQL service');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Access denied. Check your credentials in .env file:');
      console.log(`   DB_USER=${process.env.DB_USER}`);
      console.log('   DB_PASSWORD=***');
    }
  }
}

testConnection();
