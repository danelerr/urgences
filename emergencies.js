window.emergencies = [];

window.createEmergency = function(tipo, descripcion, lat, lng) {
    const emergency = {
        id: Date.now(),
        tipo,
        descripcion,
        lat,
        lng,
        usuario_id: window.currentUser.id,
        estado: 'pendiente',
        fecha: new Date().toISOString(),
        unidad_asignada: null
    };
    
    window.emergencies.push(emergency);
    window.updateMapMarkers();
    
    // Update the appropriate list based on user type
    if (window.currentUser.tipo === 'operador') {
        updateOperatorDashboard();
    } else if (['bombero', 'policia', 'ambulancia'].includes(window.currentUser.tipo)) {
        updateUnitEmergencies();
    }
    
    window.saveToStorage();
}

window.updateEmergencyStatus = function(id, estado) {
    const emergency = window.emergencies.find(e => e.id === id);
    if (emergency) {
        emergency.estado = estado;
        
        if (estado === 'resuelto') {
            setTimeout(() => {
                window.updateMapMarkers();
                window.updateEmergencyList();
                updateStats();
            }, 1000);
        } else {
            window.updateMapMarkers();
            window.updateEmergencyList();
        }
        
        updateStats();
        window.updateEmergencyList();
        window.saveToStorage();
    }
}

window.getEmergenciesForUser = function(userType) {
    if (userType === 'operador') {
        return window.emergencies.filter(e => e.estado !== 'resuelto');
    }
    if (userType === 'ciudadano') {
        return window.emergencies.filter(e => e.usuario_id === window.currentUser.id && e.estado !== 'resuelto');
    }
    if (['bombero', 'policia', 'ambulancia'].includes(userType)) {
        const tipoMap = {
            'bombero': 'bomberos',
            'policia': 'policia', 
            'ambulancia': 'ambulancia'
        };
        return window.emergencies.filter(e => e.tipo === tipoMap[userType] && e.estado !== 'resuelto');
    }
    return window.emergencies.filter(e => e.tipo === userType);
}

window.updateEmergencyList = function() {
    const list = document.getElementById('emergencyList');
    if (!list) return;

    const userEmergencies = window.getEmergenciesForUser(window.currentUser.tipo);
    
    list.innerHTML = userEmergencies.map(emergency => `
        <div class="emergency-item ${emergency.tipo}" onclick="window.centerMapOnEmergency(${emergency.lat}, ${emergency.lng})">
            <div class="emergency-info">
                <strong>${window.getEmergencyEmoji(emergency.tipo)} ${emergency.descripcion}</strong>
                <div class="emergency-meta">
                    <span>Estado: ${emergency.estado}</span>
                    <span>${new Date(emergency.fecha).toLocaleString()}</span>
                </div>
            </div>
            <div class="emergency-actions">
                ${window.getEmergencyActions(emergency)}
            </div>
        </div>
    `).join('');
}

window.getEmergencyEmoji = function(tipo) {
    const emojis = {
        bomberos: '🔥',
        policia: '👮‍♂️',
        ambulancia: '🚑'
    };
    return emojis[tipo] || '⚠️';
}

window.getEmergencyActions = function(emergency) {
    if (['operador', 'bombero', 'policia', 'ambulancia'].includes(window.currentUser.tipo)) {
        return `
            <select onchange="window.updateEmergencyStatus(${emergency.id}, this.value)">
                <option value="pendiente" ${emergency.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="en progreso" ${emergency.estado === 'en progreso' ? 'selected' : ''}>En Progreso</option>
                <option value="resuelto" ${emergency.estado === 'resuelto' ? 'selected' : ''}>Resuelto</option>
            </select>
        `;
    }
    return '';
}

function updateStats() {
    const fireCount = window.emergencies.filter(e => e.tipo === 'bomberos' && e.estado !== 'resuelto').length;
    const policeCount = window.emergencies.filter(e => e.tipo === 'policia' && e.estado !== 'resuelto').length;
    const ambulanceCount = window.emergencies.filter(e => e.tipo === 'ambulancia' && e.estado !== 'resuelto').length;
    
    const fireEl = document.getElementById('fireCount');
    const policeEl = document.getElementById('policeCount');
    const ambulanceEl = document.getElementById('ambulanceCount');
    
    if (fireEl) fireEl.textContent = fireCount;
    if (policeEl) policeEl.textContent = policeCount;
    if (ambulanceEl) ambulanceEl.textContent = ambulanceCount;
}

window.centerMapOnEmergency = function(lat, lng) {
    if (window.mapReady && window.map) {
        window.map.flyTo({
            center: [lng, lat],
            zoom: 16,
            duration: 1500
        });
    }
}

window.saveToStorage = function() {
    localStorage.setItem('emergencies', JSON.stringify(window.emergencies));
    localStorage.setItem('users', JSON.stringify(window.users));
}

function loadFromStorage() {
    const storedEmergencies = localStorage.getItem('emergencies');
    const storedUsers = localStorage.getItem('users');
    
    if (storedEmergencies) {
        window.emergencies = JSON.parse(storedEmergencies);
    }
    if (storedUsers) {
        window.users = JSON.parse(storedUsers);
    }
}

loadFromStorage();