# Car Rental Web Application - Database Integration

## Overview

This is a car rental web application integrated with Oracle Database. The application allows users to browse available cars, view details, and make bookings.

## Database Credentials

- **User:** COMP214_F25_zor_26
- **Host:** oracle1.centennialcollege.ca (or 199.212.26.208)
- **Port:** 1521
- **SID:** SQLD

## Project Structure

```
car-rental-web/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Styling
├── js/
│   └── app.js              # Frontend JavaScript (now with API integration)
├── images/                 # Image assets
├── config/
│   └── database.js         # Oracle database configuration
├── server.js               # Express backend server
├── package.json            # Node.js dependencies
├── .env                    # Environment variables (DO NOT COMMIT)
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore file
└── database_setup.sql      # Database schema and sample data
```

## Setup Instructions

### 1. Database Setup

1. Connect to your Oracle database using SQL Developer or SQLPlus:

   ```
   User: COMP214_F25_zor_26
   Host: oracle1.centennialcollege.ca
   Port: 1521
   SID: SQLD
   ```

2. Run the SQL script to create tables and insert sample data:

   ```sql
   -- Run the contents of database_setup.sql
   ```

3. Verify the tables were created:
   ```sql
   SELECT table_name FROM user_tables;
   ```

### 2. Backend Setup

1. **Install Node.js** (if not already installed)

   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Install Dependencies**

   ```powershell
   npm install
   ```

3. **Configure Environment Variables**

   - Copy `.env.example` to `.env`
   - Edit `.env` and add your database password:
     ```
     DB_USER=COMP214_F25_zor_26
     DB_PASSWORD=your_actual_password_here
     DB_CONNECT_STRING=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle1.centennialcollege.ca)(PORT=1521))(CONNECT_DATA=(SID=SQLD)))
     PORT=3000
     ```

4. **Install Oracle Instant Client** (Required for oracledb package)

   **Windows:**

   - Download Oracle Instant Client from: https://www.oracle.com/database/technologies/instant-client/downloads.html
   - Extract to a folder (e.g., `C:\oracle\instantclient_19_18`)
   - Add the folder to your PATH environment variable

   **Alternative:** Use the full Oracle Client if you have it installed

### 3. Running the Application

1. **Start the Backend Server**

   ```powershell
   npm start
   ```

   Or for development with auto-restart:

   ```powershell
   npm run dev
   ```

2. **Test the Connection**

   - Open your browser and go to: http://localhost:3000/api/test-connection
   - You should see a success message with the database timestamp

3. **Open the Application**
   - Navigate to: http://localhost:3000/
   - The frontend will automatically load cars from the database

## API Endpoints

### Cars

- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car by ID
- `GET /api/car-types` - Get all car types

### Bookings

- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create a new booking

### System

- `GET /api/health` - Health check
- `GET /api/test-connection` - Test database connection

## API Usage Examples

### Fetch All Cars

```javascript
fetch("http://localhost:3000/api/cars")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Create a Booking

```javascript
fetch("http://localhost:3000/api/bookings", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    car_id: 1,
    start_date: "2025-12-10",
    end_date: "2025-12-15",
    total_cost: 249.95,
    customer_name: "John Doe",
    customer_email: "john@example.com",
    customer_phone: "555-1234",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Database Schema

### CAR_TYPES Table

- `TYPE_ID` (PK) - Car type identifier
- `TYPE_NAME` - Name of car type (Sedan, SUV, Luxury, etc.)
- `DESCRIPTION` - Description of car type

### CARS Table

- `CAR_ID` (PK) - Car identifier
- `TYPE_ID` (FK) - Reference to CAR_TYPES
- `BRAND` - Car brand
- `MODEL` - Car model
- `YEAR` - Manufacturing year
- `LICENSE_PLATE` - License plate number (unique)
- `DAILY_RATE` - Daily rental rate
- `STATUS` - Car status (available, rented, maintenance)
- `MILEAGE` - Current mileage
- `IMAGE_URL` - Car image URL

### USERS Table (Optional)

- `USER_ID` (PK) - User identifier
- `USERNAME` - Username (unique)
- `EMAIL` - Email address (unique)
- `PHONE` - Phone number
- `PASSWORD_HASH` - Hashed password

### BOOKINGS Table

- `BOOKING_ID` (PK) - Booking identifier
- `USER_ID` (FK) - Reference to USERS (nullable)
- `CAR_ID` (FK) - Reference to CARS
- `START_DATE` - Rental start date
- `END_DATE` - Rental end date
- `TOTAL_COST` - Total rental cost
- `STATUS` - Booking status (pending, confirmed, completed, cancelled)

## Troubleshooting

### "Cannot find module 'oracledb'"

- Run `npm install` to install all dependencies
- Ensure Oracle Instant Client is installed and in your PATH

### "ORA-12154: TNS:could not resolve the connect identifier"

- Check your connection string in `.env`
- Verify the host, port, and SID are correct
- Try using the IP address: 199.212.26.208

### "ORA-01017: invalid username/password"

- Verify your database password in `.env`
- Check that your account is not locked

### "Connection refused" or "ECONNREFUSED"

- Make sure the backend server is running (`npm start`)
- Check that port 3000 is not in use by another application

### Frontend not loading cars

- Open browser console (F12) to see errors
- Verify the backend is running at http://localhost:3000
- Test the API directly: http://localhost:3000/api/cars

## Security Notes

⚠️ **Important:**

- Never commit your `.env` file to version control
- The `.gitignore` file is already configured to exclude `.env`
- Change default passwords in production
- Use HTTPS in production environments
- Implement proper authentication and authorization

## Next Steps

1. **Add User Authentication**

   - Implement login/register functionality
   - Use JWT tokens for session management

2. **Add Payment Processing**

   - Integrate payment gateway
   - Store payment information securely

3. **Add Car Availability Check**

   - Prevent double-bookings
   - Show calendar availability

4. **Add Admin Panel**
   - Manage cars, bookings, and users
   - View reports and statistics

## Dependencies

- **express** - Web framework for Node.js
- **oracledb** - Oracle Database driver for Node.js
- **cors** - Enable CORS for API requests
- **dotenv** - Load environment variables from .env file
- **body-parser** - Parse incoming request bodies

## License

MIT

## Support

For issues or questions, please contact your database administrator or check the Oracle documentation.
