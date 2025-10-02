document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    setupEventListeners();
    showScreen('loginScreen');
});

function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('reportForm').addEventListener('submit', handleReport);
}

function setupUserEventListeners() {
    const reportBtn = document.getElementById('reportBtn');
    if (reportBtn) {
        reportBtn.addEventListener('click', showReportModal);
    }
    
    const myLocationBtn = document.getElementById('myLocationBtn');
    if (myLocationBtn) {
        myLocationBtn.addEventListener('click', getCurrentLocation);
    }
    
    const unitStatus = document.getElementById('unitStatus');
    if (unitStatus) {
        unitStatus.addEventListener('change', handleUnitStatusChange);
    }
    
    // Event listeners para el modal
    const useCurrentLocationBtn = document.getElementById('useCurrentLocation');
    if (useCurrentLocationBtn) {
        useCurrentLocationBtn.addEventListener('click', handleUseCurrentLocation);
    }
    
    const selectOnMapBtn = document.getElementById('selectOnMap');
    if (selectOnMapBtn) {
        selectOnMapBtn.addEventListener('click', handleSelectOnMap);
    }
}

// Función global para iniciar selección de ubicación desde el panel ciudadano
window.startLocationSelectionFromPanel = function() {
    if (window.mapReady && window.map) {
        if (typeof window.startLocationSelection === 'function') {
            window.startLocationSelection();
        } else {
            alert('Error: La función de selección no está disponible.');
        }
    } else {
        alert('El mapa se está cargando. Espera unos segundos e intenta de nuevo.');
        
        setTimeout(() => {
            if (window.mapReady && window.map) {
                if (typeof window.startLocationSelection === 'function') {
                    window.startLocationSelection();
                } else {
                    alert('El mapa aún no está completamente cargado. Intenta refrescar la página.');
                }
            } else {
                alert('El mapa aún no está completamente cargado. Intenta refrescar la página.');
            }
        }, 3000);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (login(email, password)) {
        document.getElementById('userName').textContent = window.currentUser.nombre;
        showScreen('appScreen');
        initMap();
        showUserInterface();
        setupUserEventListeners();
        updateMapMarkers();
        updateEmergencyList();
        updateStats();
    } else {
        alert('Email o contraseña incorrectos');
    }
}

function handleReport(e) {
    e.preventDefault();
    
    const tipo = document.getElementById('emergencyType').value;
    const descripcion = document.getElementById('description').value;
    
    if (!window.selectedLocation) {
        alert('Por favor selecciona una ubicación primero usando los botones del panel derecho');
        return;
    }
    
    createEmergency(tipo, descripcion, window.selectedLocation.lat, window.selectedLocation.lng);
    closeModal();
    
    // Limpiar marcador de ubicación después del reporte
    if (window.currentLocationMarker) {
        window.currentLocationMarker.remove();
        window.currentLocationMarker = null;
    }
    
    // Limpiar información de ubicación
    const locationInfo = document.getElementById('locationInfo');
    if (locationInfo) {
        locationInfo.innerHTML = '';
        locationInfo.style.display = 'none';
    }
    
    document.getElementById('reportForm').reset();
    window.selectedLocation = null;
    
    alert('¡Emergencia reportada exitosamente!');
}

function showUserInterface() {
    document.querySelectorAll('.floating-panel, .bottom-panel, .citizen-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    switch (window.currentUser.tipo) {
        case 'ciudadano':
            const citizenPanel = document.getElementById('citizenPanel');
            if (citizenPanel) {
                citizenPanel.classList.remove('hidden');
            }
            break;
        case 'operador':
        case 'bombero':
        case 'policia':
        case 'ambulancia':
            document.getElementById('operatorPanel').classList.remove('hidden');
            
            // Cambiar el título del panel según el tipo de usuario
            document.querySelector('#operatorPanel h3').textContent = 
                window.currentUser.tipo === 'operador' ? 'Panel de Operador' : 
                `Panel de ${window.currentUser.tipo.charAt(0).toUpperCase() + window.currentUser.tipo.slice(1)}`;
            
            // Limpiar cualquier marcador de ubicación que pueda estar visible
            if (window.currentLocationMarker) {
                window.currentLocationMarker.remove();
                window.currentLocationMarker = null;
            }
            break;
    }
}

window.showReportModal = function() {
    document.getElementById('reportModal').classList.remove('hidden');
    updateLocationDisplay();
}

window.closeModal = function() {
    document.getElementById('reportModal').classList.add('hidden');
    window.selectingLocation = false;
    hideClickIndicator();
    
    const display = document.getElementById('selectedLocationDisplay');
    if (display) {
        display.style.display = 'none';
    }
}

window.openGoogleMaps = function(lat, lng) {
    openGoogleMaps(lat, lng);
};

function handleUnitStatusChange(e) {
    if (!window.currentUser) return;
    
    const newStatus = e.target.value;
    const userIndex = window.users.findIndex(u => u.id === window.currentUser.id);
    
    if (userIndex !== -1) {
        window.users[userIndex].estado = newStatus;
        window.currentUser.estado = newStatus;
        saveToStorage();
    }
}

window.handleUseCurrentLocation = function() {
    getCurrentLocation();
    setTimeout(() => {
        if (window.selectedLocation) {
            updateLocationDisplay();
        }
    }, 1000);
}

window.handleSelectOnMap = function() {
    closeModal();
    window.startLocationSelection();
    alert('Haz clic en cualquier lugar del mapa para seleccionar la ubicación de la emergencia');
}