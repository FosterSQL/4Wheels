require('dotenv').config();
const oracledb = require('oracledb');

async function checkTables() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });
        
        console.log('Tables in your database:\n');
        
        const result = await connection.execute(
            'SELECT table_name FROM user_tables ORDER BY table_name'
        );
        
        result.rows.forEach(row => console.log('   ' + row[0]));
        
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        if (connection) await connection.close();
    }
}

checkTables();
