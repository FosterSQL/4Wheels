// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// State management
let allCars = [];
let filteredCars = [];
let selectedCar = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    fetchCarsFromDatabase();
    setMinDate();
});

// Fetch cars from the database via API
async function fetchCarsFromDatabase() {
    try {
        const response = await fetch(`${API_BASE_URL}/cars`);
        const data = await response.json();
        
        if (data.success) {
            // Transform database column names to match frontend expectations
            // Handle both uppercase (Oracle default) and lowercase column names
            allCars = data.data.map(car => ({
                car_id: car.CAR_ID || car.car_id,
                type_id: car.TYPE_ID || car.type_id,
                type_name: car.TYPE_NAME || car.type_name,
                brand: car.BRAND || car.brand,
                model: car.MODEL || car.model,
                year: car.YEAR || car.year,
                license_plate: car.LICENSE_PLATE || car.license_plate,
                daily_rate: car.DAILY_RATE || car.daily_rate,
                status: car.STATUS || car.status,
                mileage: car.MILEAGE || car.mileage,
                image_url: car.IMAGE_URL || car.image_url || `https://via.placeholder.com/400x250?text=${car.BRAND || car.brand}+${car.MODEL || car.model}`
            }));
            
            filteredCars = [...allCars];
            loadCars();
        } else {
            console.error('Failed to fetch cars:', data.error);
            showErrorMessage('Failed to load cars from database');
        }
    } catch (error) {
        console.error('Error fetching cars:', error);
        showErrorMessage('Unable to connect to the server. Please ensure the backend is running.');
    }
}

// Show error message to user
function showErrorMessage(message) {
    const carsGrid = document.getElementById('cars-grid');
    if (carsGrid) {
        carsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; margin-bottom: 16px;"></i>
                <h3>${message}</h3>
                <p style="margin-top: 12px;">Make sure the server is running with: <code>npm start</code></p>
            </div>
        `;
    }
}

// Load and display cars
function loadCars() {
    const carsGrid = document.getElementById('cars-grid');
    
    if (filteredCars.length === 0) {
        carsGrid.innerHTML = '<div class="no-results">No cars found matching your criteria.</div>';
        return;
    }
    
    carsGrid.innerHTML = filteredCars.map(car => createCarCard(car)).join('');
}

// Create car card HTML
function createCarCard(car) {
    const statusClass = `status-${car.status}`;
    const isAvailable = car.status === 'available';
    
    return `
        <div class="car-card" data-car-id="${car.car_id}">
            <img src="${car.image_url}" alt="${car.brand} ${car.model}" class="car-image" 
                 onerror="this.src='https://via.placeholder.com/400x250?text=${car.brand}+${car.model}'">
            <div class="car-info">
                <div class="car-header">
                    <h3 class="car-title">${car.brand} ${car.model}</h3>
                    <span class="car-type">${car.type_name}</span>
                </div>
                <div class="car-details">
                    <span><i class="fas fa-calendar"></i> ${car.year}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${car.mileage.toLocaleString()} km</span>
                    <span class="car-status ${statusClass}">${car.status}</span>
                </div>
                <div class="car-footer">
                    <div class="car-price">
                        $${car.daily_rate.toFixed(2)}
                        <span>/day</span>
                    </div>
                    ${isAvailable 
                        ? `<button class="btn-book" onclick="openBookingModal(${car.car_id})">Book Now</button>`
                        : `<button class="btn-book" disabled style="background: #9ca3af; cursor: not-allowed;">Unavailable</button>`
                    }
                </div>
            </div>
        </div>
    `;
}

// Filter cars based on search criteria
function filterCars() {
    const carType = document.getElementById('car-type').value;
    const searchTerm = document.getElementById('search').value.toLowerCase();
    
    filteredCars = allCars.filter(car => {
        const matchesType = !carType || car.type_name === carType;
        const matchesSearch = !searchTerm || 
            car.model.toLowerCase().includes(searchTerm) ||
            car.brand.toLowerCase().includes(searchTerm);
        
        return matchesType && matchesSearch;
    });
    
    loadCars();
}

// Modal functions
function openBookingModal(carId) {
    selectedCar = allCars.find(car => car.car_id === carId);
    if (!selectedCar) return;
    
    document.getElementById('summary-car').textContent = `${selectedCar.brand} ${selectedCar.model}`;
    document.getElementById('summary-rate').textContent = `$${selectedCar.daily_rate.toFixed(2)}`;
    
    const modal = document.getElementById('booking-modal');
    modal.style.display = 'block';
    
    // Add event listeners for date changes
    document.getElementById('start-date').addEventListener('change', calculateTotal);
    document.getElementById('end-date').addEventListener('change', calculateTotal);
}

function closeBookingModal() {
    document.getElementById('booking-modal').style.display = 'none';
    document.getElementById('booking-form').reset();
    selectedCar = null;
}

// Calculate total cost
function calculateTotal() {
    if (!selectedCar) return;
    
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    
    if (startDate && endDate && endDate > startDate) {
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const total = days * selectedCar.daily_rate;
        
        document.getElementById('summary-days').textContent = `${days} day${days > 1 ? 's' : ''}`;
        document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
    }
}

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    
    if (startDate) startDate.setAttribute('min', today);
    if (endDate) endDate.setAttribute('min', today);
}

// Form submissions
async function submitBooking(event) {
    event.preventDefault();
    
    const bookingData = {
        user_id: null, // Would come from logged-in user
        car_id: selectedCar.car_id,
        start_date: document.getElementById('start-date').value,
        end_date: document.getElementById('end-date').value,
        total_cost: parseFloat(document.getElementById('summary-total').textContent.replace('$', '')),
        payment_method: document.getElementById('payment-method').value,
        customer_name: document.getElementById('customer-name').value,
        customer_email: document.getElementById('customer-email').value,
        customer_phone: document.getElementById('customer-phone').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(`Booking Confirmed!\n\nBooking ID: ${data.booking_id}\nCar: ${selectedCar.brand} ${selectedCar.model}\nTotal: ${document.getElementById('summary-total').textContent}`);
            closeBookingModal();
            // Refresh cars to update availability
            fetchCarsFromDatabase();
        } else {
            alert('Booking failed: ' + data.error);
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        alert('Failed to submit booking. Please ensure the server is running.');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const bookingModal = document.getElementById('booking-modal');
    
    if (event.target === bookingModal) {
        closeBookingModal();
    }
}
