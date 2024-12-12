// Initialize Stripe
const stripe = Stripe('your_publishable_key'); // Replace with your actual Stripe publishable key

// DOM Elements
const appointmentForm = document.getElementById('appointment-form');
const timeSelect = document.getElementById('appointment-time');
const modal = document.getElementById('payment-modal');
const closeModal = document.querySelector('.close-modal');
const bookButtons = document.querySelectorAll('.book-button');

// Service prices
const servicePrices = {
    'horoscope': 2500,
    'career': 3000,
    'relationship': 2800
};

// Generate time slots
function generateTimeSlots() {
    timeSelect.innerHTML = '<option value="">Select Time</option>';
    const times = [
        '10:00', '11:00', '12:00', '14:00', 
        '15:00', '16:00', '17:00', '18:00'
    ];
    
    times.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
}

// Initialize time slots
generateTimeSlots();

// Handle service card button clicks
bookButtons.forEach(button => {
    button.addEventListener('click', () => {
        const service = button.dataset.service;
        document.getElementById('service-type').value = service;
        document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' });
    });
});

// Form submission handler
appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Basic form validation
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service-type').value,
        date: document.getElementById('appointment-date').value,
        time: document.getElementById('appointment-time').value
    };

    if (!validateForm(formData)) {
        return;
    }

    // Show payment modal
    showPaymentModal(formData);
});

// Form validation
function validateForm(data) {
    if (!data.name || !data.email || !data.phone || !data.service || !data.date || !data.time) {
        alert('Please fill in all fields');
        return false;
    }

    if (!isValidEmail(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }

    if (!isValidPhone(data.phone)) {
        alert('Please enter a valid phone number');
        return false;
    }

    return true;
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Phone validation
function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
}

// Show payment modal
function showPaymentModal(formData) {
    const amount = servicePrices[formData.service];
    const paymentContainer = document.getElementById('payment-form-container');
    
    // Create payment form
    const form = document.createElement('form');
    form.id = 'payment-form';
    form.innerHTML = `
        <div class="form-row">
            <div id="card-element"></div>
            <div id="card-errors" role="alert"></div>
        </div>
        <button type="submit">Pay ₹${amount}</button>
    `;
    
    paymentContainer.innerHTML = '';
    paymentContainer.appendChild(form);
    
    // Create Stripe elements
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');
    
    // Handle payment form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const { token } = await stripe.createToken(card);
            // Here you would typically send the token to your server
            // along with the appointment details
            handlePaymentSuccess(formData, token);
        } catch (error) {
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
        }
    });
    
    modal.style.display = 'block';
}

// Handle successful payment
function handlePaymentSuccess(formData, paymentToken) {
    // Here you would typically make an API call to your server
    // to process the payment and save the appointment
    
    alert('Booking confirmed! You will receive a confirmation email shortly.');
    modal.style.display = 'none';
    appointmentForm.reset();
}

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Disable past dates in date picker
const appointmentDate = document.getElementById('appointment-date');
const today = new Date().toISOString().split('T')[0];
appointmentDate.min = today;

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
