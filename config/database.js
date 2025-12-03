const oracledb = require('oracledb');
require('dotenv').config();

// Oracle client configuration
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Connection pool configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 2,
  poolTimeout: 60
};

// Initialize connection pool
async function initialize() {
  try {
    await oracledb.createPool(dbConfig);
    console.log('Oracle Database connection pool created successfully');
  } catch (err) {
    console.error('Error creating Oracle Database connection pool:', err);
    throw err;
  }
}

// Get a connection from the pool
async function getConnection() {
  try {
    const connection = await oracledb.getConnection();
    return connection;
  } catch (err) {
    console.error('Error getting connection from pool:', err);
    throw err;
  }
}

// Close connection pool
async function close() {
  try {
    await oracledb.getPool().close(10);
    console.log('Oracle Database connection pool closed');
  } catch (err) {
    console.error('Error closing connection pool:', err);
    throw err;
  }
}

module.exports = {
  initialize,
  getConnection,
  close
};
