
// Function to receive data from Flutter
function receiveFromFlutter(data) {
    console.log('📥 Received from Flutter:', data);

    if (data.type === 'toggleKioskLock') {
        toggleKioskLock(data.value);
    } else if (data.type === 'togglePoweredBy') {
        togglePoweredBy(data.value);
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
        lockIcon.textContent = '🔓'; // Show unlock icon
        lockIcon.style.visibility = 'visible';
        console.log('🔒 Kiosk locked');
    } else {
        // Unlock the kiosk
        mainContent.classList.remove('hidden');
        drawerBtn.classList.remove('hidden');
        lockIcon.textContent = '🔒'; // Show lock icon
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

function showDummyControlls() {
    const dummyControls = document.getElementById('dummyControls');
    if (dummyControls) {
        dummyControls.classList.remove('hidden');
        console.log('👁️ Dummy controls visible');
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