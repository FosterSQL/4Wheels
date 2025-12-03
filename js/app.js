// Sample data representing the Oracle database schema
// In production, this would come from API calls to your Oracle Express backend

const carsData = [
    {
        car_id: 1,
        type_id: 1,
        type_name: "Sedan",
        brand: "Toyota",
        model: "Camry",
        year: 2023,
        license_plate: "ABC-1234",
        daily_rate: 49.99,
        status: "available",
        mileage: 15000,
        image_url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=500&fit=crop"
    },
    {
        car_id: 2,
        type_id: 2,
        type_name: "SUV",
        brand: "Honda",
        model: "CR-V",
        year: 2024,
        license_plate: "XYZ-5678",
        daily_rate: 69.99,
        status: "available",
        mileage: 8000,
        image_url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=500&fit=crop"
    },
    {
        car_id: 3,
        type_id: 3,
        type_name: "Luxury",
        brand: "BMW",
        model: "5 Series",
        year: 2024,
        license_plate: "LUX-9012",
        daily_rate: 129.99,
        status: "available",
        mileage: 5000,
        image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=500&fit=crop"
    },
    {
        car_id: 4,
        type_id: 4,
        type_name: "Sports",
        brand: "Mercedes",
        model: "AMG GT",
        year: 2024,
        license_plate: "SPT-3456",
        daily_rate: 199.99,
        status: "available",
        mileage: 3000,
        image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=500&fit=crop"
    }
];

// State management
let allCars = [...carsData];
let filteredCars = [...carsData];
let selectedCar = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadCars();
    setMinDate();
});

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
function submitBooking(event) {
    event.preventDefault();
    
    // In production, this would send data to your Oracle backend
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
    
    console.log('Booking submitted:', bookingData);
    
    // Show success message
    alert(`Booking Confirmed!\n\nCar: ${selectedCar.brand} ${selectedCar.model}\nTotal: ${document.getElementById('summary-total').textContent}`);
    
    closeBookingModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const bookingModal = document.getElementById('booking-modal');
    
    if (event.target === bookingModal) {
        closeBookingModal();
    }
}
