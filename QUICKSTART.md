# Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Add Your Database Password

1. Open the `.env` file
2. Replace `your_password_here` with your actual Oracle database password:
   ```
   DB_PASSWORD=your_actual_password
   ```

### Step 2: Set Up Database Tables

1. Open Oracle SQL Developer or SQLPlus
2. Connect with your credentials:
   - User: COMP214_F25_zor_26
   - Host: oracle1.centennialcollege.ca
   - Port: 1521
   - SID: SQLD
3. Run all commands from `database_setup.sql`

### Step 3: Install Dependencies

Open PowerShell in this folder and run:

```powershell
npm install
```

### Step 4: Install Oracle Instant Client (if needed)

- Download from: https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html
- Extract to a folder (e.g., C:\oracle\instantclient_19_18)
- Add to PATH or set environment variable

### Step 5: Start the Server

```powershell
npm start
```

### Step 6: Open the Application

Open your browser and go to: http://localhost:3000

## Testing the Connection

Test if everything works:

```powershell
# In a new PowerShell window:
curl http://localhost:3000/api/test-connection
```

Or visit in browser: http://localhost:3000/api/test-connection

## Common Issues

**Error: Cannot find module 'oracledb'**
→ Run: `npm install`

**Error: Oracle Instant Client not found**
→ Install Oracle Instant Client and add to PATH

**Error: Connection refused**
→ Make sure server is running with `npm start`

**Error: Invalid username/password**
→ Check your password in `.env` file

## Need Help?

See `DATABASE_INTEGRATION.md` for detailed documentation.
