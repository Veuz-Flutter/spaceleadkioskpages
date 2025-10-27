
// Function to receive data from Flutter
function receiveFromFlutter(data) {
    console.log('📥 Received from Flutter:', data);

    if (data.type === 'toggleKioskLock') {
        toggleKioskLock(data.value);
    } else if (data.type === 'togglePoweredBy') {
        togglePoweredBy(data.value);
    } else if (data.type === 'toggleCustomerDetails') {
        // Pass the customer data object (if available) or null
        toggleCustomerDetails(data.customerData !== undefined ? data.customerData : data.value);
    }
}

// Function to send data to Flutter
function sendToFlutter(data) {
    try {
        if (window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('FlutterChannel', JSON.stringify(data));
            console.log('📤 Sent to Flutter:', data);
        }
    } catch (error) {
        console.error('❌ Error sending to Flutter:', error);
    }
}

// Check-in functions
function checkInWithQR() {
    console.log('🔍 QR Code check-in initiated');

    // show modal
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.classList.add('visible');
        modal.setAttribute('aria-hidden', 'false');

        // clear previous timeout if any
        if (window.__qrModalTimeout) {
            clearTimeout(window.__qrModalTimeout);
        }

        // auto-close after 5 seconds
        window.__qrModalTimeout = setTimeout(() => {
            modal.classList.remove('visible');
            modal.setAttribute('aria-hidden', 'true');
        }, 3000);
    }

    sendToFlutter({
        type: 'checkInQR',
        timestamp: new Date().toISOString()
    });
}

function checkInWithSearch() {
    console.log('🔍 Search check-in initiated');
    sendToFlutter({
        type: 'checkInSearch',
        timestamp: new Date().toISOString()
    });
}


function openDrawer() {
    console.log('✅ open drawer');
    sendToFlutter({
        type: 'openDrawer',
        timestamp: new Date().toISOString()
    });
}

// Kiosk lock state
let isKioskLocked = false;

function toggleKioskLock(value) {
    // If value is provided (true/false), use it; otherwise toggle
    isKioskLocked = value !== undefined ? value : !isKioskLocked;

    const mainContent = document.getElementById('mainContent');
    const drawerBtn = document.querySelector('.drawer-btn');
    const footer = document.querySelector('.footer');
    const lockIcon = document.getElementById('lockIcon');

    if (isKioskLocked) {
        // Lock the kiosk
        mainContent.classList.add('hidden');
        drawerBtn.classList.add('hidden');
        // lockIcon.textContent = '🔓'; // Show unlock icon
        lockIcon.style.visibility = 'visible';
        console.log('🔒 Kiosk locked');
    } else {
        // Unlock the kiosk
        mainContent.classList.remove('hidden');
        drawerBtn.classList.remove('hidden');
        // lockIcon.textContent = '🔒'; // Show lock icon
        // change the lock icon visiblity hidden
        lockIcon.style.visibility = 'hidden';
        console.log('🔓 Kiosk unlocked');
    }
    sendToFlutter({
        type: 'toggleKioskLock',
        value: isKioskLocked,
        timestamp: new Date().toISOString(),
    });
}

// Powered-by visibility state
let isPoweredByVisible = true;

function togglePoweredBy(value) {
    // If value is provided (true/false), use it; otherwise toggle
    isPoweredByVisible = value !== undefined ? value : !isPoweredByVisible;

    const footer = document.querySelector('.footer');

    if (isPoweredByVisible) {
        // Show powered-by logo
        footer.classList.remove('hidden');
        console.log('👁️ Powered-by logo visible');
    } else {
        // Hide powered-by logo
        footer.classList.add('hidden');
        console.log('🙈 Powered-by logo hidden');
    }
    sendToFlutter({
        type: 'togglePoweredBy',
        value: isPoweredByVisible,
        timestamp: new Date().toISOString(),
    });
}

function unlockKioskLock() {
    console.log('✅ unlock kiosk');
    sendToFlutter({
        type: 'unlockKioskLock',
        timestamp: new Date().toISOString()
    });
}

function hideDummyControlls() {
    const dummyControls = document.getElementById('dummyControls');
    if (dummyControls) {
        dummyControls.classList.add('hidden');
        console.log('🙈 Dummy controls hidden');
    }
}

function showWelcome(userData) {
    console.log('👋 Welcome message shown', userData);

    // Update welcome message with user data
    if (userData) {
        // Extract the name from userData
        const firstName = userData.firstname || '';
        const lastName = userData.lastname || '';
        const fullName = firstName ? `${firstName} ${lastName}`.trim() : 'Visitor';

        // Update the welcome message content
        const welcomeName = document.getElementById('welcome-name');
        if (welcomeName) {
            welcomeName.textContent = fullName;
        }
    } else {
        // Default message if no data provided
        const welcomeName = document.getElementById('welcome-name');
        if (welcomeName) {
            welcomeName.textContent = '';
        }
    }

    // Show the welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.classList.remove('hidden');

        // Hide the message after 5 seconds
        setTimeout(() => {
            welcomeMessage.classList.add('hidden');
            console.log('🙈 Welcome message hidden');
        }, 5000);
    }

    sendToFlutter({
        type: 'showWelcome',
        data: userData,
        timestamp: new Date().toISOString()
    });
}

function showDummyControlls() {
    const dummyControls = document.getElementById('dummyControls');
    if (dummyControls) {
        dummyControls.classList.remove('hidden');
        console.log('👁️ Dummy controls visible');
    }
}

// Customer details data
let customerData = null;
let isCustomerDetailsVisible = false;

function toggleCustomerDetails(data) {

    const detailsPanel = document.getElementById('customerDetailsPanel');

    // If data is provided, use it
    if (data !== undefined && data !== null) {
        // Store customer data
        customerData = data;
        isCustomerDetailsVisible = true;

        // Populate the fields with customer data
        updateCustomerDetailsDisplay(data);

        // Show the panel
        if (detailsPanel) {
            detailsPanel.classList.remove('hidden');
            console.log('👁️ Customer details visible with data:', data);
        }
    } else if (data === null) {
        // Hide the panel
        isCustomerDetailsVisible = false;
        customerData = null;
        if (detailsPanel) {
            detailsPanel.classList.add('hidden');
            console.log('🙈 Customer details hidden');
        }
    }

    sendToFlutter({
        type: 'toggleCustomerDetails',
        value: isCustomerDetailsVisible,
        data: customerData,
        timestamp: new Date().toISOString(),
    });
}

function updateCustomerDetailsDisplay(data) {
    // Update each field with the customer data from Flutter model
    updateField('customer-field-firstname', data.firstname || '');
    updateField('customer-field-lastname', data.lastname || '');
    updateField('customer-field-email', data.email || '');
    updateField('customer-field-phone', data.mobile || '');
    updateField('customer-field-company', data.company || '');
    updateField('customer-field-job', data.designation || '');
    updateField('customer-field-nationality', data.nationality || '');
    // Ticket info (ticket object with nested properties)
    const ticketInfo = data.ticket ? (data.ticket.ticket_display_name || data.ticket.name || '') : '';
    updateField('customer-field-ticket', ticketInfo);
}

function updateField(id, value) {
    const field = document.getElementById(id);
    if (field) {
        field.textContent = value;
    }
}

// Function called from Flutter to update user details form
function updateUserDetailsForm(userData) {

    sendToFlutter({
        type: 'log',
        timestamp: new Date().toISOString()
    });

    if (userData && Object.keys(userData).length > 0) {
        // Show and populate customer details
        toggleCustomerDetails(userData);
    } else {
        // Hide customer details if no data
        toggleCustomerDetails(null);
    }
}

// Notify Flutter that page is loaded
window.addEventListener('load', function () {
    console.log('✅ Event Check-In page loaded');
    sendToFlutter({
        type: 'pageLoaded',
        timestamp: new Date().toISOString()
    });
});