# 🚀 Quick Database Setup Guide

## You have two options to set up your database:

---

## ✅ Option 1: Use Your Complete Schema (RECOMMENDED)

You already have a complete database schema in **`4WheelsDB_v3.txt`** with all tables and sample data!

### Steps:

1. **Open Oracle SQL Developer or SQLPlus**

2. **Connect with your credentials:**

   - User: `COMP214_F25_zor_26`
   - Host: `oracle1.centennialcollege.ca`
   - Port: `1521`
   - SID: `SQLD`
   - Password: [Your password]

3. **Open the file `4WheelsDB_v3.txt`**

4. **Run the entire script**

   - In SQL Developer: Click "Run Script" (F5)
   - In SQLPlus: `@4WheelsDB_v3.txt`

5. **Done!** 🎉

Your database will have:

- ✅ 6 Tables created
- ✅ 10 Users
- ✅ 10 Car Types
- ✅ 10 Cars
- ✅ 10 Rentals
- ✅ 10 Payments
- ✅ 10 Reviews

---

## ⚡ Option 2: Minimal Setup (database_setup.sql)

If you want a simpler version with fewer records, use `database_setup.sql` (but **Option 1 is better**!)

---

## 🧪 Verify Setup

After running the script, test your setup:

```powershell
npm test
```

You should see:

```
✅ Database connection successful!
✓ Car_Types
✓ Cars
✓ Users
✓ Rentals
✓ Payments
✓ Reviews

Car Types: 10 records
Cars: 10 records
Users: 10 records
...
```

---

## 🚗 Start Using Your App

Once the database is set up:

```powershell
npm start
```

Then open: **http://localhost:3000**

You'll see all 10 cars from your database! 🎉

---

## 📝 Your Database Tables

### 1. Users (10 records)

- Customer and admin accounts
- Includes: John Doe, Jane Smith, Jan Mistica, Diego Gonzalez, etc.

### 2. Car_Types (10 records)

- SUV, Sedan, Truck, Convertible, Van
- Micro, OFF-ROAD, Limousine, Muscle, Hyper

### 3. Cars (10 records)

- Toyota RAV4 ($75/day)
- Honda Accord ($65/day)
- Ford F-150 ($85/day)
- BMW Z4 ($120/day)
- Mercedes Sprinter ($95/day)
- Microlino ($50/day)
- Ford Bronco ($127/day)
- RollsRoyce Limo ($200/day)
- Chevrolet Camaro ($134/day)
- Bugatti Bolide ($364/day)

### 4. Rentals (10 records)

- Various bookings from different users

### 5. Payments (10 records)

- Payment transactions for rentals

### 6. Reviews (10 records)

- Customer reviews with ratings

---

## ❓ Troubleshooting

### "Table already exists" error?

The script starts by dropping existing tables, so it's safe to run multiple times.

### "Insufficient privileges" error?

Make sure you're logged in with your account: `COMP214_F25_zor_26`

### Still having issues?

Check that your password is correct in `.env` file.

---

## 🎯 Recommended: Use 4WheelsDB_v3.txt

The `4WheelsDB_v3.txt` file is your complete, production-ready database schema with all features and sample data. This is what you should use!

Just run it once in Oracle SQL Developer and you're done! ✅
