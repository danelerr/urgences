// Estado global de la aplicación
let currentUser = null;
let emergencies = [];
let users = [];
let userLocation = null;

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Inicializar datos si no existen
function initializeApp() {
    // Verificar si existen datos en localStorage
    if (!localStorage.getItem('fokinprot_users')) {
        loadInitialData();
    } else {
        loadDataFromStorage();
    }
    
    // Mostrar pantalla de login
    showScreen('loginScreen');
}

// Cargar datos iniciales de prueba
function loadInitialData() {
    users = [
        {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'ciudadano@test.com',
            password: '123456',
            tipo_usuario: 'ciudadano',
            estado: 'activo',
            telefono: '123456789',
            ubicacion_lat: -34.6037,
            ubicacion_lng: -58.3816,
            fecha_creacion: new Date().toISOString()
        },
        {
            id: 2,
            nombre: 'María García',
            email: 'operador@test.com',
            password: '123456',
            tipo_usuario: 'operador',
            estado: 'activo',
            telefono: '987654321',
            ubicacion_lat: -34.6037,
            ubicacion_lng: -58.3816,
            fecha_creacion: new Date().toISOString()
        },
        {
            id: 3,
            nombre: 'Carlos Bombero',
            email: 'bombero@test.com',
            password: '123456',
            tipo_usuario: 'bombero',
            estado: 'disponible',
            telefono: '111222333',
            ubicacion_lat: -34.6037,
            ubicacion_lng: -58.3816,
            fecha_creacion: new Date().toISOString()
        },
        {
            id: 4,
            nombre: 'Ana Policía',
            email: 'policia@test.com',
            password: '123456',
            tipo_usuario: 'policia',
            estado: 'disponible',
            telefono: '444555666',
            ubicacion_lat: -34.6037,
            ubicacion_lng: -58.3816,
            fecha_creacion: new Date().toISOString()
        },
        {
            id: 5,
            nombre: 'Luis Paramédico',
            email: 'ambulancia@test.com',
            password: '123456',
            tipo_usuario: 'ambulancia',
            estado: 'disponible',
            telefono: '777888999',
            ubicacion_lat: -34.6037,
            ubicacion_lng: -58.3816,
            fecha_creacion: new Date().toISOString()
        }
    ];
    
    emergencies = [
        {
            id: 1,
            usuario_id: 1,
            tipo_emergencia: 'bomberos',
            descripcion: 'Incendio en edificio residencial',
            direccion: 'Calle Principal 123',
            prioridad: 'alta',
            estado: 'pendiente',
            fecha_creacion: new Date().toISOString(),
            unidad_asignada: null
        },
        {
            id: 2,
            usuario_id: 1,
            tipo_emergencia: 'ambulancia',
            descripcion: 'Persona inconsciente en la calle',
            direccion: 'Avenida Central 456',
            prioridad: 'critica',
            estado: 'en-progreso',
            fecha_creacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            unidad_asignada: 5
        }
    ];
    
    // Guardar en localStorage
    saveDataToStorage();
}

// Cargar datos desde localStorage
function loadDataFromStorage() {
    users = JSON.parse(localStorage.getItem('fokinprot_users')) || [];
    emergencies = JSON.parse(localStorage.getItem('fokinprot_emergencies')) || [];
}

// Guardar datos en localStorage
function saveDataToStorage() {
    localStorage.setItem('fokinprot_users', JSON.stringify(users));
    localStorage.setItem('fokinprot_emergencies', JSON.stringify(emergencies));
}

// Configurar event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Emergency form
    document.getElementById('emergencyForm').addEventListener('submit', handleEmergencySubmit);
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        document.getElementById('userName').textContent = user.nombre;
        showScreen('dashboardScreen');
        showUserPanel(user.tipo_usuario);
        updateDashboard();
    } else {
        alert('Email o contraseña incorrectos');
    }
}

// Manejar logout
function handleLogout() {
    currentUser = null;
    userLocation = null;
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    showScreen('loginScreen');
}

// Manejar registro
function handleRegister(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('regNombre').value;
    const email = document.getElementById('regEmail').value;
    const telefono = document.getElementById('regTelefono').value;
    const password = document.getElementById('regPassword').value;
    const tipo_usuario = document.getElementById('regTipoUsuario').value;
    
    // Verificar si el email ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        alert('Ya existe un usuario con este email');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        nombre,
        email,
        telefono,
        password,
        tipo_usuario,
        estado: tipo_usuario === 'ciudadano' ? 'activo' : 'disponible',
        ubicacion_lat: userLocation ? userLocation.lat : null,
        ubicacion_lng: userLocation ? userLocation.lng : null,
        fecha_creacion: new Date().toISOString()
    };
    
    users.push(newUser);
    saveDataToStorage();
    
    alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
    showLoginForm();
    
    // Limpiar formulario
    document.getElementById('registerForm').reset();
    document.getElementById('locationStatus').innerHTML = '';
    userLocation = null;
}

// Mostrar formularios
function showLoginForm() {
    showScreen('loginScreen');
}

function showRegisterForm() {
    showScreen('registerScreen');
}

// Mostrar pantalla
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

// Mostrar panel según tipo de usuario
function showUserPanel(userType) {
    // Ocultar todos los paneles
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    // Mostrar panel correspondiente
    switch(userType) {
        case 'ciudadano':
            document.getElementById('citizenPanel').classList.remove('hidden');
            break;
        case 'operador':
            document.getElementById('operatorPanel').classList.remove('hidden');
            break;
        case 'bombero':
        case 'policia':
        case 'ambulancia':
            document.getElementById('unitPanel').classList.remove('hidden');
            document.getElementById('unitType').textContent = 
                userType.charAt(0).toUpperCase() + userType.slice(1);
            document.getElementById('unitStatus').value = currentUser.estado || 'disponible';
            break;
    }
}

// Actualizar dashboard
function updateDashboard() {
    if (currentUser.tipo_usuario === 'ciudadano') {
        updateMyEmergencies();
    } else if (currentUser.tipo_usuario === 'operador') {
        updateOperatorStats();
        updateAllEmergencies();
        updateUsersList();
    } else {
        updateAssignedEmergencies();
    }
}

// Actualizar mis emergencias (ciudadano)
function updateMyEmergencies() {
    const myEmergencies = emergencies.filter(e => e.usuario_id === currentUser.id);
    const container = document.getElementById('myEmergenciesList');
    
    if (myEmergencies.length === 0) {
        container.innerHTML = '<p>No tienes emergencias reportadas.</p>';
        return;
    }
    
    container.innerHTML = myEmergencies.map(emergency => `
        <div class="emergency-item ${emergency.tipo_emergencia}">
            <div class="emergency-header">
                <div class="emergency-type">
                    ${getEmergencyIcon(emergency.tipo_emergencia)} ${emergency.tipo_emergencia.toUpperCase()}
                </div>
                <div class="emergency-status status-${emergency.estado}">${emergency.estado}</div>
            </div>
            <div class="emergency-details">
                <p><strong>Descripción:</strong> ${emergency.descripcion || 'Sin descripción'}</p>
                <p><strong>Dirección:</strong> ${emergency.direccion || 'No especificada'}</p>
            </div>
            <div class="emergency-meta">
                <span class="priority-${emergency.prioridad}">${emergency.prioridad}</span>
                <span>📅 ${formatDate(emergency.fecha_creacion)}</span>
            </div>
        </div>
    `).join('');
}

// Actualizar estadísticas del operador
function updateOperatorStats() {
    const activeEmergencies = emergencies.filter(e => e.estado !== 'resuelto').length;
    const availableUnits = users.filter(u => 
        ['bombero', 'policia', 'ambulancia'].includes(u.tipo_usuario) && 
        u.estado === 'disponible'
    ).length;
    const totalUsers = users.length;
    
    document.getElementById('activeEmergencies').textContent = activeEmergencies;
    document.getElementById('availableUnits').textContent = availableUnits;
    document.getElementById('totalUsers').textContent = totalUsers;
}

// Actualizar todas las emergencias (operador)
function updateAllEmergencies() {
    const container = document.getElementById('allEmergenciesList');
    const statusFilter = document.getElementById('filterStatus').value;
    const typeFilter = document.getElementById('filterType').value;
    
    let filteredEmergencies = emergencies;
    
    if (statusFilter) {
        filteredEmergencies = filteredEmergencies.filter(e => e.estado === statusFilter);
    }
    
    if (typeFilter) {
        filteredEmergencies = filteredEmergencies.filter(e => e.tipo_emergencia === typeFilter);
    }
    
    if (filteredEmergencies.length === 0) {
        container.innerHTML = '<p>No hay emergencias que coincidan con los filtros.</p>';
        return;
    }
    
    container.innerHTML = filteredEmergencies.map(emergency => {
        const user = users.find(u => u.id === emergency.usuario_id);
        const assignedUnit = emergency.unidad_asignada ? 
            users.find(u => u.id === emergency.unidad_asignada) : null;
        
        return `
            <div class="emergency-item ${emergency.tipo_emergencia}">
                <div class="emergency-header">
                    <div class="emergency-type">
                        ${getEmergencyIcon(emergency.tipo_emergencia)} ${emergency.tipo_emergencia.toUpperCase()}
                    </div>
                    <div class="emergency-status status-${emergency.estado}">${emergency.estado}</div>
                </div>
                <div class="emergency-details">
                    <p><strong>Reportado por:</strong> ${user ? user.nombre : 'Usuario desconocido'}</p>
                    <p><strong>Descripción:</strong> ${emergency.descripcion || 'Sin descripción'}</p>
                    <p><strong>Dirección:</strong> ${emergency.direccion || 'No especificada'}</p>
                    ${emergency.ubicacion_lat && emergency.ubicacion_lng ? 
                        `<p><strong>Coordenadas:</strong> ${emergency.ubicacion_lat.toFixed(4)}, ${emergency.ubicacion_lng.toFixed(4)}</p>` : ''
                    }
                    ${assignedUnit ? `<p><strong>Unidad asignada:</strong> ${assignedUnit.nombre}</p>` : ''}
                </div>
                <div class="emergency-meta">
                    <span class="priority-${emergency.prioridad}">${emergency.prioridad}</span>
                    <span>📅 ${formatDate(emergency.fecha_creacion)}</span>
                    <button onclick="assignEmergency(${emergency.id})" class="btn btn-primary" style="font-size: 0.8rem; padding: 5px 10px;">
                        ${emergency.unidad_asignada ? 'Reasignar' : 'Asignar'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Actualizar emergencias asignadas (unidades)
function updateAssignedEmergencies() {
    const assignedEmergencies = emergencies.filter(e => e.unidad_asignada === currentUser.id);
    const container = document.getElementById('assignedEmergenciesList');
    
    if (assignedEmergencies.length === 0) {
        container.innerHTML = '<p>No tienes emergencias asignadas.</p>';
        return;
    }
    
    container.innerHTML = assignedEmergencies.map(emergency => {
        const user = users.find(u => u.id === emergency.usuario_id);
        
        return `
            <div class="emergency-item ${emergency.tipo_emergencia}">
                <div class="emergency-header">
                    <div class="emergency-type">
                        ${getEmergencyIcon(emergency.tipo_emergencia)} ${emergency.tipo_emergencia.toUpperCase()}
                    </div>
                    <div class="emergency-status status-${emergency.estado}">${emergency.estado}</div>
                </div>
                <div class="emergency-details">
                    <p><strong>Reportado por:</strong> ${user ? user.nombre : 'Usuario desconocido'}</p>
                    <p><strong>Descripción:</strong> ${emergency.descripcion || 'Sin descripción'}</p>
                    <p><strong>Dirección:</strong> ${emergency.direccion || 'No especificada'}</p>
                </div>
                <div class="emergency-meta">
                    <span class="priority-${emergency.prioridad}">${emergency.prioridad}</span>
                    <span>📅 ${formatDate(emergency.fecha_creacion)}</span>
                    <button onclick="updateEmergencyStatus(${emergency.id})" class="btn btn-primary" style="font-size: 0.8rem; padding: 5px 10px;">
                        Actualizar Estado
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Crear nueva emergencia
function createEmergency(type) {
    document.getElementById('emergencyType').value = type;
    document.getElementById('emergencyModal').classList.remove('hidden');
}

// Cerrar modal de emergencia
function closeEmergencyModal() {
    document.getElementById('emergencyModal').classList.add('hidden');
    document.getElementById('emergencyForm').reset();
}

// Manejar envío de emergencia
function handleEmergencySubmit(e) {
    e.preventDefault();
    
    const        emergencyData = {
        id: Date.now(), // ID simple basado en timestamp
        usuario_id: currentUser.id,
        tipo_emergencia: document.getElementById('emergencyType').value,
        descripcion: document.getElementById('description').value,
        direccion: document.getElementById('address').value,
        prioridad: document.getElementById('priority').value,
        estado: 'pendiente',
        fecha_creacion: new Date().toISOString(),
        unidad_asignada: null,
        ubicacion_lat: userLocation ? userLocation.lat : null,
        ubicacion_lng: userLocation ? userLocation.lng : null
    };
    
    emergencies.push(emergencyData);
    saveDataToStorage();
    
    closeEmergencyModal();
    updateDashboard();
    userLocation = null; // Limpiar ubicación temporal
    document.getElementById('emergencyLocationStatus').innerHTML = '';
    
    alert('¡Emergencia reportada exitosamente! Las unidades serán notificadas.');
}

// Actualizar estado de la unidad
function updateUnitStatus() {
    const newStatus = document.getElementById('unitStatus').value;
    currentUser.estado = newStatus;
    
    // Actualizar en el array de usuarios
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].estado = newStatus;
        saveDataToStorage();
    }
    
    alert(`Estado actualizado a: ${newStatus}`);
}

// Asignar emergencia (función simplificada)
function assignEmergency(emergencyId) {
    const availableUnits = users.filter(u => 
        ['bombero', 'policia', 'ambulancia'].includes(u.tipo_usuario) && 
        u.estado === 'disponible'
    );
    
    if (availableUnits.length === 0) {
        alert('No hay unidades disponibles en este momento.');
        return;
    }
    
    // Asignar a la primera unidad disponible (simplificado)
    const emergency = emergencies.find(e => e.id === emergencyId);
    if (emergency) {
        emergency.unidad_asignada = availableUnits[0].id;
        emergency.estado = 'en-progreso';
        
        // Cambiar estado de la unidad
        availableUnits[0].estado = 'en_servicio';
        
        saveDataToStorage();
        updateDashboard();
        
        alert(`Emergencia asignada a ${availableUnits[0].nombre}`);
    }
}

// Actualizar estado de emergencia
function updateEmergencyStatus(emergencyId) {
    const newStatus = prompt('Nuevo estado (pendiente/en-progreso/resuelto):');
    
    if (newStatus && ['pendiente', 'en-progreso', 'resuelto'].includes(newStatus)) {
        const emergency = emergencies.find(e => e.id === emergencyId);
        if (emergency) {
            emergency.estado = newStatus;
            
            // Si se resuelve, liberar la unidad
            if (newStatus === 'resuelto' && emergency.unidad_asignada) {
                const unit = users.find(u => u.id === emergency.unidad_asignada);
                if (unit) {
                    unit.estado = 'disponible';
                }
            }
            
            saveDataToStorage();
            updateDashboard();
            
            alert(`Estado actualizado a: ${newStatus}`);
        }
    } else {
        alert('Estado no válido. Use: pendiente, en-progreso o resuelto');
    }
}

// Funciones de utilidad
function getEmergencyIcon(type) {
    switch(type) {
        case 'bomberos': return '🔥';
        case 'policia': return '👮';
        case 'ambulancia': return '🚑';
        default: return '🚨';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Funciones de geolocalización
function getCurrentLocation() {
    const statusElement = document.getElementById('locationStatus');
    
    if (!navigator.geolocation) {
        statusElement.innerHTML = '<div class="location-error">Geolocalización no soportada por este navegador.</div>';
        return;
    }
    
    statusElement.innerHTML = '<div class="location-loading">📍 Obteniendo ubicación...</div>';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            statusElement.innerHTML = `<div class="location-success">✅ Ubicación obtenida: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</div>`;
        },
        function(error) {
            let errorMessage = 'Error al obtener ubicación: ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Acceso denegado por el usuario.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Ubicación no disponible.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Tiempo de espera agotado.';
                    break;
                default:
                    errorMessage += 'Error desconocido.';
                    break;
            }
            statusElement.innerHTML = `<div class="location-error">${errorMessage}</div>`;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

function getCurrentLocationForEmergency() {
    const statusElement = document.getElementById('emergencyLocationStatus');
    
    if (!navigator.geolocation) {
        statusElement.innerHTML = '<div class="location-error">Geolocalización no soportada por este navegador.</div>';
        return;
    }
    
    statusElement.innerHTML = '<div class="location-loading">📍 Obteniendo ubicación...</div>';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            statusElement.innerHTML = `<div class="location-success">✅ Ubicación obtenida: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</div>`;
            document.getElementById('address').value = `Coordenadas: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
        },
        function(error) {
            let errorMessage = 'Error al obtener ubicación: ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Acceso denegado por el usuario.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Ubicación no disponible.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Tiempo de espera agotado.';
                    break;
                default:
                    errorMessage += 'Error desconocido.';
                    break;
            }
            statusElement.innerHTML = `<div class="location-error">${errorMessage}</div>`;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

function updateUserLocation() {
    if (!navigator.geolocation) {
        alert('Geolocalización no soportada por este navegador.');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            currentUser.ubicacion_lat = position.coords.latitude;
            currentUser.ubicacion_lng = position.coords.longitude;
            
            // Actualizar en el array de usuarios
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].ubicacion_lat = position.coords.latitude;
                users[userIndex].ubicacion_lng = position.coords.longitude;
                saveDataToStorage();
            }
            
            alert(`Ubicación actualizada: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        function(error) {
            alert('Error al obtener ubicación: ' + error.message);
        }
    );
}

// Actualizar lista de usuarios (operador)
function updateUsersList() {
    const container = document.getElementById('usersList');
    
    if (users.length === 0) {
        container.innerHTML = '<p>No hay usuarios registrados.</p>';
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="user-item ${user.tipo_usuario}">
            <div class="user-info-details">
                <div class="user-name">${user.nombre}</div>
                <div class="user-meta">
                    <span>📧 ${user.email}</span>
                    <span>📞 ${user.telefono}</span>
                    <span>👤 ${user.tipo_usuario}</span>
                    <span class="user-status status-${user.estado}">${user.estado}</span>
                </div>
            </div>
            <div class="user-actions">
                <button onclick="changeUserStatus(${user.id})" class="btn btn-primary" style="font-size: 0.8rem; padding: 5px 10px;">
                    Cambiar Estado
                </button>
            </div>
        </div>
    `).join('');
}

// Cambiar estado de usuario
function changeUserStatus(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    let newStatus;
    if (user.tipo_usuario === 'ciudadano') {
        newStatus = prompt('Nuevo estado (activo/inactivo):', user.estado);
        if (newStatus && ['activo', 'inactivo'].includes(newStatus)) {
            user.estado = newStatus;
        } else {
            alert('Estado no válido para ciudadano.');
            return;
        }
    } else {
        newStatus = prompt('Nuevo estado (disponible/en_servicio/fuera_servicio):', user.estado);
        if (newStatus && ['disponible', 'en_servicio', 'fuera_servicio'].includes(newStatus)) {
            user.estado = newStatus;
        } else {
            alert('Estado no válido para unidad de emergencia.');
            return;
        }
    }
    
    saveDataToStorage();
    updateUsersList();
    updateOperatorStats();
    
    alert(`Estado de ${user.nombre} actualizado a: ${newStatus}`);
}
