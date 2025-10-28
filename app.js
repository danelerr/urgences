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
    // Reload user data from storage to ensure we have the latest
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        window.users = JSON.parse(storedUsers);
        // Update currentUser with latest data
        const updatedUser = window.users.find(u => u.id === window.currentUser.id);
        if (updatedUser) {
            window.currentUser = updatedUser;
        }
    }
    
    document.querySelectorAll('.floating-panel, .bottom-panel, .citizen-panel, .operator-dashboard').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    const toggleBtn = document.getElementById('togglePanelBtn');
    
    switch (window.currentUser.tipo) {
        case 'ciudadano':
            const citizenPanel = document.getElementById('citizenPanel');
            if (citizenPanel) {
                citizenPanel.classList.remove('hidden');
            }
            if (toggleBtn) toggleBtn.classList.add('hidden');
            break;
        case 'operador':
            document.getElementById('operatorPanel').classList.remove('hidden');
            if (toggleBtn) toggleBtn.classList.remove('hidden');
            updateOperatorDashboard();
            
            // Limpiar cualquier marcador de ubicación que pueda estar visible
            if (window.currentLocationMarker) {
                window.currentLocationMarker.remove();
                window.currentLocationMarker = null;
            }
            break;
        case 'bombero':
        case 'policia':
        case 'ambulancia':
            document.getElementById('unitPanel').classList.remove('hidden');
            const unitTypeLabel = document.getElementById('unitTypeLabel');
            if (unitTypeLabel) {
                unitTypeLabel.textContent = `Panel de ${window.currentUser.tipo.charAt(0).toUpperCase() + window.currentUser.tipo.slice(1)}`;
            }
            
            // Set the initial status from latest data
            const unitStatus = document.getElementById('unitStatus');
            if (unitStatus) {
                unitStatus.value = window.currentUser.estado || 'disponible';
                console.log('Unit initial estado:', window.currentUser.estado);
            }
            
            if (toggleBtn) toggleBtn.classList.add('hidden');
            updateUnitEmergencies();
            
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

function handleUnitStatusChange() {
    if (!window.currentUser) return;
    
    const newStatus = document.getElementById('unitStatus').value;
    const userIndex = window.users.findIndex(u => u.id === window.currentUser.id);
    
    if (userIndex !== -1) {
        window.users[userIndex].estado = newStatus;
        window.currentUser.estado = newStatus;
        saveToStorage();
        
        console.log('Estado changed:', { 
            usuario: window.currentUser.nombre, 
            nuevoEstado: newStatus,
            allUsers: window.users.filter(u => ['bombero', 'policia', 'ambulancia'].includes(u.tipo))
                .map(u => ({ nombre: u.nombre, estado: u.estado }))
        });
        
        alert(`Estado actualizado a: ${newStatus}`);
    }
}

// Toggle operator panel
window.toggleOperatorPanel = function() {
    const panel = document.getElementById('operatorPanel');
    const toggleBtn = document.getElementById('togglePanelBtn');
    
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        if (toggleBtn) toggleBtn.textContent = '✕ Cerrar';
    } else {
        panel.classList.add('hidden');
        if (toggleBtn) toggleBtn.textContent = '📊 Dashboard';
    }
}

// Update operator dashboard
window.updateOperatorDashboard = function() {
    updateOperatorStats();
    updateOperatorEmergencies();
    updateUsersList();
}

// Update operator stats
function updateOperatorStats() {
    // Reload users from storage to ensure we have the latest data
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        window.users = JSON.parse(storedUsers);
    }
    
    const activeEmergencies = window.emergencies.filter(e => e.estado !== 'resuelto').length;
    
    // Count available units - be flexible with estado check
    const availableUnits = window.users.filter(u => {
        const isEmergencyUnit = ['bombero', 'policia', 'ambulancia'].includes(u.tipo);
        const isAvailable = u.estado === 'disponible' || u.estado === 'activo';
        return isEmergencyUnit && isAvailable;
    }).length;
    
    const totalUsers = window.users.length;
    
    const activeEl = document.getElementById('activeEmergencies');
    const availableEl = document.getElementById('availableUnits');
    const totalEl = document.getElementById('totalUsers');
    
    if (activeEl) activeEl.textContent = activeEmergencies;
    if (availableEl) availableEl.textContent = availableUnits;
    if (totalEl) totalEl.textContent = totalUsers;
    
    // Debug log
    console.log('Available units:', availableUnits, 'Total units:', window.users.filter(u => 
        ['bombero', 'policia', 'ambulancia'].includes(u.tipo)
    ).map(u => ({ nombre: u.nombre, tipo: u.tipo, estado: u.estado })));
}

// Update operator emergencies list
window.updateOperatorEmergencies = function() {
    const list = document.getElementById('operatorEmergencyList');
    if (!list) return;
    
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    const typeFilter = document.getElementById('filterType')?.value || '';
    
    let filteredEmergencies = window.emergencies.filter(e => {
        if (statusFilter && e.estado !== statusFilter) return false;
        if (typeFilter && e.tipo !== typeFilter) return false;
        return true;
    });
    
    if (filteredEmergencies.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay emergencias que coincidan con los filtros.</p>';
        return;
    }
    
    list.innerHTML = filteredEmergencies.map(emergency => {
        const user = window.users.find(u => u.id === emergency.usuario_id);
        const assignedUnit = emergency.unidad_asignada ? 
            window.users.find(u => u.id === emergency.unidad_asignada) : null;
        
        return `
            <div class="emergency-item-operator ${emergency.tipo}" onclick="window.centerMapOnEmergency(${emergency.lat}, ${emergency.lng})">
                <div class="emergency-header">
                    <div class="emergency-type-label">
                        ${window.getEmergencyEmoji(emergency.tipo)} ${emergency.tipo.toUpperCase()}
                    </div>
                    <div class="emergency-status-badge status-${emergency.estado.replace(' ', '-')}">${emergency.estado}</div>
                </div>
                <div class="emergency-details">
                    <p><strong>Reportado por:</strong> ${user ? user.nombre : 'Usuario desconocido'}</p>
                    <p><strong>Descripción:</strong> ${emergency.descripcion}</p>
                    <p><strong>Ubicación:</strong> ${emergency.lat.toFixed(4)}, ${emergency.lng.toFixed(4)}</p>
                    ${assignedUnit ? `<p><strong>Unidad asignada:</strong> ${assignedUnit.nombre} (${assignedUnit.tipo})</p>` : '<p><strong>Sin asignar</strong></p>'}
                </div>
                <div class="emergency-footer">
                    <span class="emergency-date">${new Date(emergency.fecha).toLocaleString()}</span>
                    <button onclick="event.stopPropagation(); assignEmergencyToUnit(${emergency.id})" class="btn btn-small btn-primary">
                        ${emergency.unidad_asignada ? 'Reasignar' : 'Asignar'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Assign emergency to unit
window.assignEmergencyToUnit = function(emergencyId) {
    const emergency = window.emergencies.find(e => e.id === emergencyId);
    if (!emergency) return;
    
    // Reload users from storage to get the latest data
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        window.users = JSON.parse(storedUsers);
    }
    
    // Map emergency type to unit type
    const emergencyTypeToUnitType = {
        'bomberos': 'bombero',
        'policia': 'policia',
        'ambulancia': 'ambulancia'
    };
    
    const requiredUnitType = emergencyTypeToUnitType[emergency.tipo];
    
    // Filter available units - only matching type
    const availableUnits = window.users.filter(u => {
        const isCorrectType = u.tipo === requiredUnitType;
        const isAvailable = u.estado === 'disponible' || u.estado === 'activo';
        return isCorrectType && isAvailable;
    });
    
    // Debug log
    console.log('Trying to assign emergency:', emergencyId, 'Tipo:', emergency.tipo);
    console.log('Required unit type:', requiredUnitType);
    console.log('All units of correct type:', window.users.filter(u => u.tipo === requiredUnitType)
        .map(u => ({ nombre: u.nombre, tipo: u.tipo, estado: u.estado })));
    console.log('Available units of correct type:', availableUnits.map(u => ({ nombre: u.nombre, tipo: u.tipo, estado: u.estado })));
    
    if (availableUnits.length === 0) {
        const emergencyTypeName = emergency.tipo.charAt(0).toUpperCase() + emergency.tipo.slice(1);
        alert(`No hay unidades de ${emergencyTypeName} disponibles en este momento. Verifica que estén en estado "disponible".`);
        return;
    }
    
    // Create a selection list with estado
    let unitOptions = availableUnits.map((u, i) => 
        `${i + 1}. ${u.nombre} - ${u.tipo.charAt(0).toUpperCase() + u.tipo.slice(1)} (${u.estado})`
    ).join('\n');
    
    const emergencyTypeName = emergency.tipo.charAt(0).toUpperCase() + emergency.tipo.slice(1);
    const selection = prompt(`Asignar emergencia de ${emergencyTypeName}\nSelecciona una unidad (1-${availableUnits.length}):\n\n${unitOptions}`);
    
    if (selection) {
        const index = parseInt(selection) - 1;
        if (index >= 0 && index < availableUnits.length) {
            const selectedUnit = availableUnits[index];
            emergency.unidad_asignada = selectedUnit.id;
            emergency.estado = 'en progreso';
            
            // Update unit status
            const unitIndex = window.users.findIndex(u => u.id === selectedUnit.id);
            if (unitIndex !== -1) {
                window.users[unitIndex].estado = 'en_servicio';
            }
            
            saveToStorage();
            updateOperatorDashboard();
            updateMapMarkers();
            
            alert(`Emergencia asignada exitosamente a ${selectedUnit.nombre}. Su estado cambió a "en servicio".`);
        } else {
            alert('Selección no válida');
        }
    }
}

// Update users list
function updateUsersList() {
    const list = document.getElementById('usersList');
    if (!list) return;
    
    list.innerHTML = window.users.map(user => `
        <div class="user-item user-type-${user.tipo}">
            <div class="user-info">
                <div class="user-name">${user.nombre}</div>
                <div class="user-meta">
                    <span>📧 ${user.email}</span>
                    <span>👤 ${user.tipo}</span>
                    <span class="user-status status-${user.estado || 'activo'}">${user.estado || 'activo'}</span>
                </div>
            </div>
            <button onclick="changeUserStatus(${user.id})" class="btn btn-small btn-secondary">
                Cambiar Estado
            </button>
        </div>
    `).join('');
}

// Change user status
window.changeUserStatus = function(userId) {
    // Reload latest data
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        window.users = JSON.parse(storedUsers);
    }
    
    const user = window.users.find(u => u.id === userId);
    if (!user) return;
    
    let newStatus;
    if (user.tipo === 'ciudadano') {
        newStatus = prompt('Nuevo estado (activo/inactivo):', user.estado || 'activo');
        if (newStatus && ['activo', 'inactivo'].includes(newStatus)) {
            user.estado = newStatus;
        } else {
            alert('Estado no válido para ciudadano. Usa: activo o inactivo');
            return;
        }
    } else {
        newStatus = prompt('Nuevo estado (disponible/en_servicio/fuera_servicio):', user.estado || 'disponible');
        if (newStatus && ['disponible', 'en_servicio', 'fuera_servicio'].includes(newStatus)) {
            user.estado = newStatus;
        } else {
            alert('Estado no válido para unidad de emergencia. Usa: disponible, en_servicio o fuera_servicio');
            return;
        }
    }
    
    // Update in the users array
    const userIndex = window.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        window.users[userIndex].estado = newStatus;
    }
    
    saveToStorage();
    updateUsersList();
    updateOperatorStats();
    
    console.log('User status changed by operator:', { 
        usuario: user.nombre, 
        nuevoEstado: newStatus,
        allUnits: window.users.filter(u => ['bombero', 'policia', 'ambulancia'].includes(u.tipo))
            .map(u => ({ nombre: u.nombre, estado: u.estado }))
    });
    
    alert(`Estado de ${user.nombre} actualizado a: ${newStatus}`);
}

// Switch unit tabs
window.switchUnitTab = function(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    
    if (tab === 'assigned') {
        tabs[0].classList.add('active');
        document.getElementById('assignedTab').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('availableTab').classList.add('active');
    }
}

// Update unit emergencies
window.updateUnitEmergencies = function() {
    updateAssignedEmergencies();
    updateAvailableEmergencies();
}

// Update assigned emergencies for units
function updateAssignedEmergencies() {
    const list = document.getElementById('assignedEmergenciesList');
    if (!list) return;
    
    const assignedEmergencies = window.emergencies.filter(e => 
        e.unidad_asignada === window.currentUser.id && e.estado !== 'resuelto'
    );
    
    if (assignedEmergencies.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No tienes emergencias asignadas.</p>';
        return;
    }
    
    list.innerHTML = assignedEmergencies.map(emergency => {
        const user = window.users.find(u => u.id === emergency.usuario_id);
        
        return `
            <div class="emergency-item-unit ${emergency.tipo}" onclick="window.centerMapOnEmergency(${emergency.lat}, ${emergency.lng})">
                <div class="emergency-info-unit">
                    <div class="emergency-type-badge">${window.getEmergencyEmoji(emergency.tipo)} ${emergency.tipo.toUpperCase()}</div>
                    <p><strong>${emergency.descripcion}</strong></p>
                    <p>Reportado por: ${user ? user.nombre : 'Desconocido'}</p>
                    <p>📍 ${emergency.lat.toFixed(4)}, ${emergency.lng.toFixed(4)}</p>
                    <div class="emergency-status-inline">Estado: ${emergency.estado}</div>
                </div>
                <div class="emergency-actions-unit">
                    <select onchange="updateAssignedEmergencyStatus(${emergency.id}, this.value); event.stopPropagation();" class="status-select">
                        <option value="pendiente" ${emergency.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="en progreso" ${emergency.estado === 'en progreso' ? 'selected' : ''}>En Progreso</option>
                        <option value="resuelto" ${emergency.estado === 'resuelto' ? 'selected' : ''}>Resuelto</option>
                    </select>
                    <button onclick="unassignEmergency(${emergency.id}); event.stopPropagation();" class="btn btn-small btn-danger">
                        Desasignar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Update available emergencies for units
function updateAvailableEmergencies() {
    const list = document.getElementById('availableEmergenciesList');
    if (!list) return;
    
    const tipoMap = {
        'bombero': 'bomberos',
        'policia': 'policia', 
        'ambulancia': 'ambulancia'
    };
    
    const availableEmergencies = window.emergencies.filter(e => 
        !e.unidad_asignada && 
        e.estado === 'pendiente' &&
        e.tipo === tipoMap[window.currentUser.tipo]
    );
    
    if (availableEmergencies.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No hay emergencias disponibles para tu tipo de unidad.</p>';
        return;
    }
    
    list.innerHTML = availableEmergencies.map(emergency => {
        const user = window.users.find(u => u.id === emergency.usuario_id);
        
        return `
            <div class="emergency-item-unit ${emergency.tipo}" onclick="window.centerMapOnEmergency(${emergency.lat}, ${emergency.lng})">
                <div class="emergency-info-unit">
                    <div class="emergency-type-badge">${window.getEmergencyEmoji(emergency.tipo)} ${emergency.tipo.toUpperCase()}</div>
                    <p><strong>${emergency.descripcion}</strong></p>
                    <p>Reportado por: ${user ? user.nombre : 'Desconocido'}</p>
                    <p>📍 ${emergency.lat.toFixed(4)}, ${emergency.lng.toFixed(4)}</p>
                    <div class="emergency-status-inline">Estado: ${emergency.estado}</div>
                </div>
                <div class="emergency-actions-unit">
                    <button onclick="selfAssignEmergency(${emergency.id}); event.stopPropagation();" class="btn btn-small btn-success">
                        Asignarme
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Self assign emergency
window.selfAssignEmergency = function(emergencyId) {
    const emergency = window.emergencies.find(e => e.id === emergencyId);
    if (!emergency) {
        alert('Emergencia no encontrada');
        return;
    }
    
    if (emergency.unidad_asignada) {
        alert('Esta emergencia ya está asignada a otra unidad');
        return;
    }
    
    // Get the current status from the select element to ensure accuracy
    const currentStatus = document.getElementById('unitStatus')?.value || window.currentUser.estado;
    
    // Check if user is available (allow both 'disponible' states)
    if (currentStatus !== 'disponible') {
        alert(`Debes estar en estado "disponible" para asignarte una emergencia. Tu estado actual es: "${currentStatus}"`);
        return;
    }
    
    emergency.unidad_asignada = window.currentUser.id;
    emergency.estado = 'en progreso';
    
    // Update user status
    window.currentUser.estado = 'en_servicio';
    const userIndex = window.users.findIndex(u => u.id === window.currentUser.id);
    if (userIndex !== -1) {
        window.users[userIndex].estado = 'en_servicio';
    }
    
    document.getElementById('unitStatus').value = 'en_servicio';
    
    saveToStorage();
    updateUnitEmergencies();
    updateMapMarkers();
    
    alert('Te has asignado exitosamente a la emergencia. Tu estado cambió a "en servicio".');
}

// Update assigned emergency status
window.updateAssignedEmergencyStatus = function(emergencyId, newStatus) {
    const emergency = window.emergencies.find(e => e.id === emergencyId);
    if (!emergency) return;
    
    emergency.estado = newStatus;
    
    if (newStatus === 'resuelto') {
        // Free up the unit
        window.currentUser.estado = 'disponible';
        const userIndex = window.users.findIndex(u => u.id === window.currentUser.id);
        if (userIndex !== -1) {
            window.users[userIndex].estado = 'disponible';
        }
        document.getElementById('unitStatus').value = 'disponible';
        
        alert('Emergencia marcada como resuelta. Tu estado cambió a "disponible".');
    }
    
    saveToStorage();
    updateUnitEmergencies();
    updateMapMarkers();
}

// Unassign emergency
window.unassignEmergency = function(emergencyId) {
    if (!confirm('¿Estás seguro de que deseas desasignarte de esta emergencia?')) {
        return;
    }
    
    const emergency = window.emergencies.find(e => e.id === emergencyId);
    if (!emergency) return;
    
    emergency.unidad_asignada = null;
    emergency.estado = 'pendiente';
    
    // Update user status to available
    window.currentUser.estado = 'disponible';
    const userIndex = window.users.findIndex(u => u.id === window.currentUser.id);
    if (userIndex !== -1) {
        window.users[userIndex].estado = 'disponible';
    }
    document.getElementById('unitStatus').value = 'disponible';
    
    saveToStorage();
    updateUnitEmergencies();
    updateMapMarkers();
    
    console.log('Emergency unassigned:', { emergencyId, usuario: window.currentUser.nombre, nuevoEstado: 'disponible' });
    
    alert('Te has desasignado de la emergencia. Tu estado cambió a "disponible".');
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