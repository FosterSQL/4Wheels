// Test script to verify database connection and setup
// Run with: node test-connection.js

require('dotenv').config();
const oracledb = require('oracledb');

async function testConnection() {
    let connection;
    
    console.log('='.repeat(60));
    console.log('🔧 4Wheels Database Connection Test');
    console.log('='.repeat(60));
    console.log();
    
    // Check environment variables
    console.log('📋 Checking environment variables...');
    console.log(`   DB_USER: ${process.env.DB_USER ? '✓ Set' : '✗ Missing'}`);
    console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '✓ Set' : '✗ Missing'}`);
    console.log(`   DB_CONNECT_STRING: ${process.env.DB_CONNECT_STRING ? '✓ Set' : '✗ Missing'}`);
    console.log();
    
    if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_CONNECT_STRING) {
        console.error('❌ Environment variables missing. Please check your .env file.');
        return;
    }
    
    try {
        console.log('🔌 Attempting to connect to Oracle Database...');
        console.log(`   Host: oracle1.centennialcollege.ca`);
        console.log(`   User: ${process.env.DB_USER}`);
        console.log();
        
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });
        
        console.log('✅ Database connection successful!');
        console.log();
        
        // Test basic query
        console.log('🔍 Testing basic query...');
        const result = await connection.execute('SELECT SYSDATE FROM DUAL');
        console.log(`   Current database time: ${result.rows[0][0]}`);
        console.log('✅ Query executed successfully!');
        console.log();
        
        // Check if tables exist
        console.log('📊 Checking database tables...');
        const tables = await connection.execute(`
            SELECT table_name 
            FROM user_tables 
            WHERE table_name IN ('CAR_TYPES', 'CARS', 'USERS', 'RENTALS', 'PAYMENTS', 'REVIEWS')
            ORDER BY table_name
        `);
        
        const expectedTables = ['CAR_TYPES', 'CARS', 'USERS', 'RENTALS', 'PAYMENTS', 'REVIEWS'];
        const foundTables = tables.rows.map(row => row[0]);
        
        expectedTables.forEach(table => {
            const exists = foundTables.includes(table);
            console.log(`   ${exists ? '✓' : '✗'} ${table}`);
        });
        console.log();
        
        if (foundTables.length === 0) {
            console.log('⚠️  No tables found. Please run database_setup.sql first.');
            console.log();
        } else if (foundTables.length < expectedTables.length) {
            console.log('⚠️  Some tables are missing. Please run database_setup.sql.');
            console.log();
        } else {
            // Check data in tables
            console.log('📈 Checking table data...');
            
            const carTypesCount = await connection.execute('SELECT COUNT(*) as count FROM CAR_TYPES');
            console.log(`   Car Types: ${carTypesCount.rows[0][0]} records`);
            
            const carsCount = await connection.execute('SELECT COUNT(*) as count FROM CARS');
            console.log(`   Cars: ${carsCount.rows[0][0]} records`);
            
            const usersCount = await connection.execute('SELECT COUNT(*) as count FROM USERS');
            console.log(`   Users: ${usersCount.rows[0][0]} records`);
            
            const rentalsCount = await connection.execute('SELECT COUNT(*) as count FROM RENTALS');
            console.log(`   Rentals: ${rentalsCount.rows[0][0]} records`);
            
            const paymentsCount = await connection.execute('SELECT COUNT(*) as count FROM PAYMENTS');
            console.log(`   Payments: ${paymentsCount.rows[0][0]} records`);
            
            const reviewsCount = await connection.execute('SELECT COUNT(*) as count FROM REVIEWS');
            console.log(`   Reviews: ${reviewsCount.rows[0][0]} records`);
            
            console.log();
            
            if (carsCount.rows[0][0] > 0) {
                console.log('🚗 Sample cars in database:');
                const sampleCars = await connection.execute(`
                    SELECT BRAND, MODEL, DAILY_RATE, STATUS 
                    FROM CARS 
                    WHERE ROWNUM <= 3
                    ORDER BY CAR_ID
                `);
                
                sampleCars.rows.forEach(car => {
                    console.log(`   • ${car[0]} ${car[1]} - $${car[2]}/day (${car[3]})`);
                });
                console.log();
            }
            
            console.log('✅ All checks passed! Your database is ready.');
            console.log();
            console.log('🚀 Next step: Run "npm start" to start the application');
        }
        
    } catch (err) {
        console.error('❌ Connection failed!');
        console.error();
        console.error('Error details:');
        console.error(`   ${err.message}`);
        console.error();
        console.error('💡 Troubleshooting:');
        console.error('   1. Check your password in .env file');
        console.error('   2. Verify your database account is not locked');
        console.error('   3. Ensure Oracle Instant Client is installed');
        console.error('   4. Try using IP address: 199.212.26.208 in connection string');
        console.error();
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
    
    console.log('='.repeat(60));
}

testConnection();
