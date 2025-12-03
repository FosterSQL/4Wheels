# 4Wheels Car Rental API Documentation

Complete API documentation for the 4Wheels Car Rental backend server.

## Base URL

```
http://localhost:3000/api
```

---

## 🚗 Cars Endpoints

### GET /api/cars

Get all cars with their type information.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "car_id": 1,
      "type_id": 1,
      "type_name": "SUV",
      "brand": "Toyota",
      "model": "RAV4",
      "year": 2023,
      "license_plate": "ABC-1234",
      "daily_rate": 75.0,
      "status": "available",
      "mileage": 12000,
      "image_url": "https://..."
    }
  ]
}
```

### GET /api/cars/:id

Get details of a specific car.

**Parameters:**

- `id` - Car ID (number)

**Example:** `GET /api/cars/1`

---

## 🏷️ Car Types Endpoints

### GET /api/car-types

Get all car types.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "type_id": 1,
      "type_name": "SUV",
      "description": "Sport Utility Vehicle with 5 seats"
    }
  ]
}
```

**Available Types:**

1. SUV
2. Sedan
3. Truck
4. Convertible
5. Van
6. Micro
7. OFF-ROAD
8. Limousine
9. Muscle
10. Hyper

---

## 📅 Bookings/Rentals Endpoints

### POST /api/bookings

Create a new rental booking.

**Request Body:**

```json
{
  "user_id": 1,
  "car_id": 1,
  "start_date": "2025-12-10",
  "end_date": "2025-12-15",
  "total_cost": 375.0
}
```

**Response:**

```json
{
  "success": true,
  "message": "Booking created successfully",
  "rental_id": 11
}
```

### GET /api/bookings

Get all rental bookings.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "rental_id": 1,
      "user_id": 1,
      "car_id": 1,
      "brand": "Toyota",
      "model": "RAV4",
      "start_date": "2025-11-10T00:00:00.000Z",
      "end_date": "2025-11-15T00:00:00.000Z",
      "total_cost": 375.0,
      "status": "booked",
      "created_at": "2025-12-03T00:00:00.000Z"
    }
  ]
}
```

### GET /api/bookings/:id

Get details of a specific booking.

**Parameters:**

- `id` - Rental ID (number)

**Booking Statuses:**

- `booked` - Reservation confirmed
- `ongoing` - Rental in progress
- `completed` - Rental finished
- `cancelled` - Booking cancelled

---

## 👥 Users Endpoints

### GET /api/users

Get all registered users (admin endpoint).

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone_number": "555-1001",
      "role": "customer",
      "created_at": "2025-11-01T00:00:00.000Z"
    }
  ]
}
```

**User Roles:**

- `customer` - Regular customer
- `admin` - Administrator

---

## ⭐ Reviews Endpoints

### GET /api/reviews/car/:carId

Get all reviews for a specific car.

**Parameters:**

- `carId` - Car ID (number)

**Example:** `GET /api/reviews/car/1`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "review_id": 1,
      "user_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "car_id": 1,
      "rating": 5,
      "commentary": "Smooth ride, very comfortable.",
      "created_at": "2025-11-15T00:00:00.000Z"
    }
  ]
}
```

**Rating Scale:** 1-5 stars

---

## 💳 Payments Endpoints

### GET /api/payments

Get all payment transactions.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "payment_id": 1,
      "rental_id": 1,
      "amount": 375.0,
      "payment_method": "credit_card",
      "payment_date": "2025-11-10T00:00:00.000Z",
      "status": "completed",
      "user_id": 1,
      "car_id": 1
    }
  ]
}
```

**Payment Methods:**

- `credit_card`
- `paypal`
- `debit_card`
- `cash`

**Payment Statuses:**

- `completed` - Payment successful
- `pending` - Payment processing
- `failed` - Payment failed

---

## 📊 Statistics Endpoints

### GET /api/stats/rentals

Get rental statistics and revenue summary.

**Response:**

```json
{
  "success": true,
  "data": {
    "total_rentals": 10,
    "booked": 5,
    "ongoing": 2,
    "completed": 2,
    "cancelled": 1,
    "total_revenue": 5559.0
  }
}
```

---

## 🔧 System Endpoints

### GET /api/health

Check if the server is running.

**Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-03T10:30:00.000Z"
}
```

### GET /api/test-connection

Test database connection.

**Response:**

```json
{
  "success": true,
  "message": "Database connection successful",
  "timestamp": "2025-12-03T10:30:00.000Z"
}
```

---

## Database Schema Summary

### Tables:

1. **Users** - Customer and admin accounts
2. **Car_Types** - Vehicle categories
3. **Cars** - Vehicle inventory
4. **Rentals** - Booking transactions
5. **Payments** - Payment records
6. **Reviews** - Customer reviews

### Current Data:

- 10 Users (9 customers + 1 admin)
- 10 Car Types
- 10 Cars
- 10 Rentals
- 10 Payments
- 10 Reviews

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `404` - Resource not found
- `500` - Server error

---

## Testing with cURL

### Get all cars

```bash
curl http://localhost:3000/api/cars
```

### Get car by ID

```bash
curl http://localhost:3000/api/cars/1
```

### Create a booking

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "car_id": 2,
    "start_date": "2025-12-15",
    "end_date": "2025-12-20",
    "total_cost": 325.00
  }'
```

### Get reviews for a car

```bash
curl http://localhost:3000/api/reviews/car/1
```

### Get rental statistics

```bash
curl http://localhost:3000/api/stats/rentals
```

---

## Testing with PowerShell

### Get all cars

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/cars" -Method Get
```

### Create a booking

```powershell
$body = @{
    user_id = 1
    car_id = 2
    start_date = "2025-12-15"
    end_date = "2025-12-20"
    total_cost = 325.00
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/bookings" -Method Post -Body $body -ContentType "application/json"
```

---

## CORS Configuration

The API allows cross-origin requests from any domain for development. In production, configure CORS to allow only your frontend domain.

---

## Database Connection

**Connection Details:**

- User: COMP214_F25_zor_26
- Host: oracle1.centennialcollege.ca
- Port: 1521
- SID: SQLD

**Connection String:**

```
(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle1.centennialcollege.ca)(PORT=1521))(CONNECT_DATA=(SID=SQLD)))
```

---

## Notes

- All dates are in ISO 8601 format
- Currency amounts are in decimal format (e.g., 75.00)
- The API uses Oracle database with connection pooling
- User authentication is not yet implemented
- All endpoints are currently public (add authentication in production)

---

**Version:** 1.0  
**Last Updated:** December 3, 2025  
**Database:** Oracle 4Wheels Car Rental Database
