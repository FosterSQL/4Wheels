const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const database = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from root

// Initialize database connection pool
database.initialize()
  .then(() => {
    console.log('Database initialized successfully');
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

// ============ API ROUTES ============

// GET all available cars with their type information
app.get('/api/cars', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT 
        c.CAR_ID,
        c.TYPE_ID,
        ct.NAME as TYPE_NAME,
        c.BRAND,
        c.MODEL,
        c.YEAR,
        c.LICENSE_PLATE,
        c.DAILY_RATE,
        c.STATUS,
        c.MILEAGE,
        c.IMAGE_URL
      FROM CARS c
      JOIN CAR_TYPES ct ON c.TYPE_ID = ct.TYPE_ID
      ORDER BY c.CAR_ID`
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cars',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// GET car by ID
app.get('/api/cars/:id', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT 
        c.CAR_ID,
        c.TYPE_ID,
        ct.NAME as TYPE_NAME,
        c.BRAND,
        c.MODEL,
        c.YEAR,
        c.LICENSE_PLATE,
        c.DAILY_RATE,
        c.STATUS,
        c.MILEAGE,
        c.IMAGE_URL
      FROM CARS c
      JOIN CAR_TYPES ct ON c.TYPE_ID = ct.TYPE_ID
      WHERE c.CAR_ID = :id`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching car:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch car',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// GET all car types
app.get('/api/car-types', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT TYPE_ID, NAME as TYPE_NAME, DESCRIPTION
       FROM CAR_TYPES
       ORDER BY TYPE_ID`
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching car types:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch car types',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// POST - Create a new booking
app.post('/api/bookings', async (req, res) => {
  let connection;
  try {
    const { user_id, car_id, start_date, end_date, total_cost, customer_name, customer_email, customer_phone } = req.body;
    
    connection = await database.getConnection();
    
    // Insert rental
    const result = await connection.execute(
      `INSERT INTO RENTALS (USER_ID, CAR_ID, START_DATE, END_DATE, TOTAL_COST, STATUS)
       VALUES (:user_id, :car_id, TO_DATE(:start_date, 'YYYY-MM-DD'), TO_DATE(:end_date, 'YYYY-MM-DD'), :total_cost, 'booked')
       RETURNING RENTAL_ID INTO :rental_id`,
      {
        user_id: user_id || null,
        car_id: car_id,
        start_date: start_date,
        end_date: end_date,
        total_cost: total_cost,
        rental_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );
    
    res.json({
      success: true,
      message: 'Booking created successfully',
      rental_id: result.outBinds.rental_id[0]
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// GET all bookings
app.get('/api/bookings', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT 
        r.RENTAL_ID,
        r.USER_ID,
        r.CAR_ID,
        c.BRAND,
        c.MODEL,
        r.START_DATE,
        r.END_DATE,
        r.TOTAL_COST,
        r.STATUS,
        r.CREATED_AT
      FROM RENTALS r
      JOIN CARS c ON r.CAR_ID = c.CAR_ID
      ORDER BY r.CREATED_AT DESC`
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// GET booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT 
        r.RENTAL_ID,
        r.USER_ID,
        r.CAR_ID,
        c.BRAND,
        c.MODEL,
        c.YEAR,
        r.START_DATE,
        r.END_DATE,
        r.TOTAL_COST,
        r.STATUS,
        r.CREATED_AT
      FROM RENTALS r
      JOIN CARS c ON r.CAR_ID = c.CAR_ID
      WHERE r.RENTAL_ID = :id`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Test database connection
app.get('/api/test-connection', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    const result = await connection.execute('SELECT SYSDATE FROM DUAL');
    
    res.json({
      success: true,
      message: 'Database connection successful',
      timestamp: result.rows[0].SYSDATE
    });
  } catch (err) {
    console.error('Database connection test failed:', err);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// GET all users
app.get('/api/users', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT 
        USER_ID,
        FIRST_NAME,
        LAST_NAME,
        EMAIL,
        PHONE_NUMBER,
        ROLE,
        CREATED_AT
      FROM USERS
      ORDER BY USER_ID`
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// GET reviews for a specific car
app.get('/api/reviews/car/:carId', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT 
        r.REVIEW_ID,
        r.USER_ID,
        u.FIRST_NAME,
        u.LAST_NAME,
        r.CAR_ID,
        r.RATING,
        r.COMMENTARY,
        r.CREATED_AT
      FROM REVIEWS r
      JOIN USERS u ON r.USER_ID = u.USER_ID
      WHERE r.CAR_ID = :carId
      ORDER BY r.CREATED_AT DESC`,
      [req.params.carId]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// GET all payments
app.get('/api/payments', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT 
        p.PAYMENT_ID,
        p.RENTAL_ID,
        p.AMOUNT,
        p.PAYMENT_METHOD,
        p.PAYMENT_DATE,
        p.STATUS,
        r.USER_ID,
        r.CAR_ID
      FROM PAYMENTS p
      JOIN RENTALS r ON p.RENTAL_ID = r.RENTAL_ID
      ORDER BY p.PAYMENT_DATE DESC`
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// GET rental statistics
app.get('/api/stats/rentals', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT 
        COUNT(*) as TOTAL_RENTALS,
        SUM(CASE WHEN STATUS = 'booked' THEN 1 ELSE 0 END) as BOOKED,
        SUM(CASE WHEN STATUS = 'ongoing' THEN 1 ELSE 0 END) as ONGOING,
        SUM(CASE WHEN STATUS = 'completed' THEN 1 ELSE 0 END) as COMPLETED,
        SUM(CASE WHEN STATUS = 'cancelled' THEN 1 ELSE 0 END) as CANCELLED,
        SUM(TOTAL_COST) as TOTAL_REVENUE
      FROM RENTALS`
    );
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching rental stats:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rental statistics',
      message: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await database.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;
