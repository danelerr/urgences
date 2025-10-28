window.currentUser = null;
window.users = [
    {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'ciudadano@test.com',
        password: '123456',
        tipo: 'ciudadano',
        estado: 'activo'
    },
    {
        id: 2,
        nombre: 'María García',
        email: 'operador@test.com',
        password: '123456',
        tipo: 'operador',
        estado: 'activo'
    },
    {
        id: 3,
        nombre: 'Carlos Bombero',
        email: 'bombero@test.com',
        password: '123456',
        tipo: 'bombero',
        estado: 'disponible'
    },
    {
        id: 4,
        nombre: 'Ana Policía',
        email: 'policia@test.com',
        password: '123456',
        tipo: 'policia',
        estado: 'disponible'
    },
    {
        id: 5,
        nombre: 'Luis Paramédico',
        email: 'ambulancia@test.com',
        password: '123456',
        tipo: 'ambulancia',
        estado: 'disponible'
    }
];

function login(email, password) {
    // Reload users from storage to get latest data
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        window.users = JSON.parse(storedUsers);
    }
    
    const user = window.users.find(u => u.email === email && u.password === password);
    if (user) {
        window.currentUser = user;
        console.log('User logged in:', { nombre: user.nombre, tipo: user.tipo, estado: user.estado });
        return true;
    }
    return false;
}

function logout() {
    window.currentUser = null;
    showScreen('loginScreen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}