const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const bcrypt = require('bcrypt');
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

// POST - Create a new booking (uses database function to calculate cost)
app.post('/api/bookings', async (req, res) => {
  let connection;
  try {
    const { user_id, car_id, start_date, end_date, customer_name, customer_email, customer_phone } = req.body;
    
    connection = await database.getConnection();
    
    // Calculate cost using database function
    const costResult = await connection.execute(
      `SELECT pkg_rental_utils.fn_calculate_rental_cost(:car_id, TO_DATE(:start_date, 'YYYY-MM-DD'), TO_DATE(:end_date, 'YYYY-MM-DD')) as TOTAL_COST
       FROM DUAL`,
      { car_id, start_date, end_date }
    );
    
    const calculatedCost = costResult.rows[0].TOTAL_COST;
    
    // Insert rental with calculated cost
    const result = await connection.execute(
      `INSERT INTO RENTALS (USER_ID, CAR_ID, START_DATE, END_DATE, TOTAL_COST, STATUS)
       VALUES (:user_id, :car_id, TO_DATE(:start_date, 'YYYY-MM-DD'), TO_DATE(:end_date, 'YYYY-MM-DD'), :total_cost, 'booked')
       RETURNING RENTAL_ID INTO :rental_id`,
      {
        user_id: user_id || null,
        car_id: car_id,
        start_date: start_date,
        end_date: end_date,
        total_cost: calculatedCost,
        rental_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );
    
    res.json({
      success: true,
      message: 'Booking created successfully',
      rental_id: result.outBinds.rental_id[0],
      total_cost: calculatedCost
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

// ============ DATABASE FUNCTIONS & PROCEDURES ============

// Calculate rental cost using database function
app.post('/api/calculate-cost', async (req, res) => {
  let connection;
  try {
    const { car_id, start_date, end_date } = req.body;
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT pkg_rental_utils.fn_calculate_rental_cost(:car_id, TO_DATE(:start_date, 'YYYY-MM-DD'), TO_DATE(:end_date, 'YYYY-MM-DD')) as TOTAL_COST
       FROM DUAL`,
      { car_id, start_date, end_date }
    );
    
    res.json({
      success: true,
      total_cost: result.rows[0].TOTAL_COST,
      car_id,
      start_date,
      end_date
    });
  } catch (err) {
    console.error('Error calculating cost:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate cost',
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

// Get car status using database function
app.get('/api/car-status/:carId', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    const result = await connection.execute(
      `SELECT pkg_rental_utils.fn_get_car_status(:car_id) as CAR_STATUS
       FROM DUAL`,
      [req.params.carId]
    );
    
    res.json({
      success: true,
      car_id: req.params.carId,
      status: result.rows[0].CAR_STATUS
    });
  } catch (err) {
    console.error('Error getting car status:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to get car status',
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

// Recalculate existing rental cost using procedure
app.post('/api/rentals/:id/recalculate', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    await connection.execute(
      `BEGIN pkg_rental_ops.proc_calculate_rental_cost(:rental_id); END;`,
      [req.params.id],
      { autoCommit: true }
    );
    
    // Fetch updated rental
    const result = await connection.execute(
      `SELECT RENTAL_ID, TOTAL_COST, STATUS FROM RENTALS WHERE RENTAL_ID = :id`,
      [req.params.id]
    );
    
    res.json({
      success: true,
      message: 'Rental cost recalculated',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error recalculating rental:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to recalculate rental cost',
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

// Cancel rental using procedure
app.post('/api/rentals/:id/cancel', async (req, res) => {
  let connection;
  try {
    connection = await database.getConnection();
    
    await connection.execute(
      `BEGIN pkg_rental_ops.proc_cancel_rental(:rental_id); END;`,
      [req.params.id],
      { autoCommit: true }
    );
    
    // Fetch updated rental
    const result = await connection.execute(
      `SELECT RENTAL_ID, STATUS, TOTAL_COST FROM RENTALS WHERE RENTAL_ID = :id`,
      [req.params.id]
    );
    
    res.json({
      success: true,
      message: 'Rental cancelled successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error cancelling rental:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel rental',
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

// ============ AUTHENTICATION ROUTES ============

// POST - Register new user
app.post('/api/register', async (req, res) => {
  let connection;
  try {
    const { first_name, last_name, email, password, phone_number } = req.body;
    
    // Validate required fields
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required (first_name, last_name, email, password)'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Validate password strength (min 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }
    
    connection = await database.getConnection();
    
    // Check if email already exists
    const checkEmail = await connection.execute(
      `SELECT USER_ID FROM USERS WHERE UPPER(EMAIL) = UPPER(:email)`,
      { email }
    );
    
    if (checkEmail.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Insert new user
    const result = await connection.execute(
      `INSERT INTO USERS (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD_HASH, PHONE_NUMBER, ROLE)
       VALUES (:first_name, :last_name, :email, :password_hash, :phone_number, 'customer')
       RETURNING USER_ID INTO :user_id`,
      {
        first_name,
        last_name,
        email,
        password_hash,
        phone_number: phone_number || null,
        user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );
    
    const userId = result.outBinds.user_id[0];
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        user_id: userId,
        first_name,
        last_name,
        email,
        role: 'customer'
      }
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
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

// POST - Login user
app.post('/api/login', async (req, res) => {
  let connection;
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    connection = await database.getConnection();
    
    // Find user by email
    const result = await connection.execute(
      `SELECT USER_ID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD_HASH, PHONE_NUMBER, ROLE
       FROM USERS
       WHERE UPPER(EMAIL) = UPPER(:email)`,
      { email }
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.PASSWORD_HASH);
    
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // Return user info (excluding password hash)
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        user_id: user.USER_ID,
        first_name: user.FIRST_NAME,
        last_name: user.LAST_NAME,
        email: user.EMAIL,
        phone_number: user.PHONE_NUMBER,
        role: user.ROLE
      }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
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

// GET - Check if user is logged in (validate session)
app.get('/api/auth/check', async (req, res) => {
  // For now, this is just a placeholder since we're using localStorage on frontend
  // In a production app, you'd verify a JWT token or session here
  res.json({
    success: true,
    message: 'Auth check endpoint'
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
