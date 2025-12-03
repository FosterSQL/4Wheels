# 4Wheels - Car Rental Application

🚗 Full-stack car rental web application with Oracle Database integration.

## Live Demo

**Frontend Demo:** https://fostersql.github.io/4Wheels/

## Features

✨ **User Features:**

- Browse available cars with real-time database integration
- Filter by car type (Sedan, SUV, Luxury, Sports, Economy)
- Search by brand or model
- View detailed car information
- Book rentals with automatic cost calculation
- Responsive design for all devices

🔧 **Technical Features:**

- Full-stack application with Node.js/Express backend
- Oracle Database integration with connection pooling
- RESTful API architecture
- Real-time data fetching
- Secure environment variable management

## Database Schema

Integrated with Oracle Database (Centennial College):

- **CAR_TYPES** - Vehicle categories
- **CARS** - Vehicle inventory
- **USERS** - Customer information
- **BOOKINGS** - Rental transactions

**Database Connection:**

- Host: oracle1.centennialcollege.ca
- Port: 1521
- SID: SQLD

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Oracle Instant Client
- Access to Oracle database

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/FosterSQL/4Wheels.git
   cd 4Wheels
   ```

2. **Install dependencies:**

   ```powershell
   npm install
   ```

3. **Configure database credentials:**

   - Copy `.env.example` to `.env`
   - Add your Oracle database password in `.env`

4. **Set up database tables:**

   - Run the SQL commands from `database_setup.sql` in Oracle SQL Developer

5. **Start the server:**

   ```powershell
   npm start
   ```

6. **Open the application:**
   - Navigate to http://localhost:3000

## Documentation

📖 **Detailed Documentation:**

- [QUICKSTART.md](QUICKSTART.md) - Get started in 5 minutes
- [DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md) - Complete setup guide with troubleshooting

## API Endpoints

- `GET /api/cars` - Get all available cars
- `GET /api/cars/:id` - Get specific car details
- `GET /api/car-types` - Get all car types
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/test-connection` - Test database connection

## Technology Stack

**Frontend:**

- HTML5, CSS3, JavaScript
- Font Awesome icons
- Responsive design

**Backend:**

- Node.js
- Express.js
- Oracle Database (oracledb driver)
- CORS, dotenv, body-parser

## Project Structure

```
4Wheels/
├── index.html              # Main application page
├── css/
│   └── styles.css          # Styling
├── js/
│   └── app.js              # Frontend logic with API integration
├── config/
│   └── database.js         # Oracle DB configuration
├── server.js               # Express server with API routes
├── package.json            # Dependencies
├── database_setup.sql      # Database schema and sample data
├── .env                    # Environment variables (not tracked)
├── .env.example            # Environment template
└── README.md               # This file
```

## Development

**Run in development mode with auto-restart:**

```powershell
npm run dev
```

**Test API endpoints:**

```powershell
# Health check
curl http://localhost:3000/api/health

# Test database connection
curl http://localhost:3000/api/test-connection

# Get all cars
curl http://localhost:3000/api/cars
```

## Deploy to GitHub Pages

**For static frontend only:**

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Enable GitHub Pages: Settings → Pages → Deploy from main branch

**Note:** Backend requires a separate hosting service (Heroku, AWS, Azure, etc.)

## Security

⚠️ **Important Security Notes:**

- Never commit `.env` file to version control
- Use environment variables for sensitive data
- Implement authentication in production
- Use HTTPS in production environments

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Contact

- Repository: https://github.com/FosterSQL/4Wheels
- Issues: https://github.com/FosterSQL/4Wheels/issues
