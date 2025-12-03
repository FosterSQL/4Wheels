// API Configuration - Use backend if available, otherwise use demo data
// For GitHub Pages: use Railway backend, for local development: use localhost
const API_BASE_URL = window.location.hostname === 'fostersql.github.io' 
    ? 'https://4wheels-production.up.railway.app/api'
    : 'http://localhost:3000/api';

// Demo data for GitHub Pages (when backend is not available)
const demoCarsData = [
    {
        car_id: 1, type_id: 1, type_name: "SUV", brand: "Toyota", model: "RAV4", year: 2023,
        license_plate: "ABC-1234", daily_rate: 75.00, status: "available", mileage: 12000,
        image_url: "https://www.buyatoyota.com/sharpr/bat/assets/img/vehicle-info/RAV4/2023/hero_image_rav4.png"
    },
    {
        car_id: 2, type_id: 2, type_name: "Sedan", brand: "Honda", model: "Accord", year: 2022,
        license_plate: "DEF-5678", daily_rate: 65.00, status: "available", mileage: 18000,
        image_url: "https://di-uploads-pod21.dealerinspire.com/performancehondafairfield/uploads/2022/07/Honda-Accord-feature-overview-fairfield-oh-500x409.jpg"
    },
    {
        car_id: 3, type_id: 3, type_name: "Truck", brand: "Ford", model: "F-150", year: 2021,
        license_plate: "GHI-9012", daily_rate: 85.00, status: "maintenance", mileage: 25000,
        image_url: "https://www.iihs.org/cdn-cgi/image/width=636/api/ratings/model-year-images/3116/"
    },
    {
        car_id: 4, type_id: 4, type_name: "Convertible", brand: "BMW", model: "Z4", year: 2023,
        license_plate: "JKL-3456", daily_rate: 120.00, status: "rented", mileage: 8000,
        image_url: "https://file.kelleybluebookimages.com/kbb/base/evox/CP/13692/2023-BMW-Z4-front_13692_032_1864x724_C37_cropped.png?downsize=750:*"
    },
    {
        car_id: 5, type_id: 5, type_name: "Van", brand: "Mercedes", model: "Sprinter", year: 2020,
        license_plate: "MNO-7890", daily_rate: 95.00, status: "available", mileage: 40000,
        image_url: "https://mkt-vehicleimages-prd.autotradercdn.ca/photos/chrome/Expanded/White/2020MBV040075/2020MBV04007501.jpg"
    },
    {
        car_id: 6, type_id: 6, type_name: "Micro", brand: "Microlino", model: "MircolinoC1", year: 2022,
        license_plate: "MIC-9090", daily_rate: 50.00, status: "available", mileage: 400,
        image_url: "https://microlino-car.com/media/thumb/thumb_width1500_microlino-gotham-anthracite-performance.png"
    },
    {
        car_id: 7, type_id: 7, type_name: "OFF-ROAD", brand: "Ford", model: "Bronco", year: 2025,
        license_plate: "BRO-4958", daily_rate: 127.00, status: "available", mileage: 60000,
        image_url: "https://www.ford.ca/cmslibs/content/dam/na/ford/en_ca/images/bronco-sport/2025/jellybeans/Ford_Bronco-Sport_2025_400A_PG1_888_89C_BY1AL_64V_T7T_99A_GTBAB_IGDAC_BLD_DEFAULT_EXT_4_010.png"
    },
    {
        car_id: 8, type_id: 8, type_name: "Limousine", brand: "RollsRoyce", model: "Limo", year: 2023,
        license_plate: "LIM-3330", daily_rate: 200.00, status: "available", mileage: 3000,
        image_url: "https://limousinesworld.com/wp-content/uploads/2021/03/phantomlimo-scaled.jpg"
    },
    {
        car_id: 9, type_id: 9, type_name: "Muscle", brand: "Chevrolet", model: "Camaro", year: 2024,
        license_plate: "CAM-7709", daily_rate: 134.00, status: "available", mileage: 70000,
        image_url: "https://cdn.motor1.com/images/mgl/xeOR6/s3/2018-chevrolet-camaro-1ss-1le.jpg"
    },
    {
        car_id: 10, type_id: 10, type_name: "Hyper", brand: "Bugatti", model: "Bolide", year: 2025,
        license_plate: "BOL-3340", daily_rate: 364.00, status: "rented", mileage: 68000,
        image_url: "https://www.topgear.com/sites/default/files/2021/10/1%20Bugatti%20Bolide.jpg"
    }
];

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
            loadDemoData();
        }
    } catch (error) {
        console.error('API not available, using demo data:', error);
        loadDemoData();
    }
}

// Load demo data for GitHub Pages
function loadDemoData() {
    allCars = [...demoCarsData];
    filteredCars = [...demoCarsData];
    loadCars();
    console.log('Running in demo mode with sample data');
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

// Calculate total cost using database function
async function calculateTotal() {
    if (!selectedCar) return;
    
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (startDate && endDate && new Date(endDate) > new Date(startDate)) {
        try {
            // Try to use database function for accurate cost calculation
            const response = await fetch(`${API_BASE_URL}/calculate-cost`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    car_id: selectedCar.car_id,
                    start_date: startDate,
                    end_date: endDate
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
                document.getElementById('summary-days').textContent = `${days} day${days > 1 ? 's' : ''}`;
                document.getElementById('summary-total').textContent = `$${data.total_cost.toFixed(2)}`;
                return;
            }
        } catch (error) {
            console.log('Using fallback calculation:', error);
        }
        
        // Fallback to client-side calculation
        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
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
            alert(`Booking Confirmed!\n\nBooking ID: ${data.rental_id}\nCar: ${selectedCar.brand} ${selectedCar.model}\nTotal: ${document.getElementById('summary-total').textContent}`);
            closeBookingModal();
            fetchCarsFromDatabase();
        } else {
            alert('Booking failed: ' + data.error);
        }
    } catch (error) {
        console.error('API not available - Demo Mode:', error);
        // Demo mode - show confirmation without saving to database
        alert(`Booking Confirmed! (Demo Mode)\n\nCar: ${selectedCar.brand} ${selectedCar.model}\nTotal: ${document.getElementById('summary-total').textContent}\n\nNote: Running in demo mode. Connect to backend to save bookings.`);
        closeBookingModal();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const bookingModal = document.getElementById('booking-modal');
    
    if (event.target === bookingModal) {
        closeBookingModal();
    }
}
