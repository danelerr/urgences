window.currentUser = null;
window.users = [
    {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'ciudadano@test.com',
        password: '123456',
        tipo: 'ciudadano'
    },
    {
        id: 2,
        nombre: 'María García',
        email: 'operador@test.com',
        password: '123456',
        tipo: 'operador'
    },
    {
        id: 3,
        nombre: 'Carlos Bombero',
        email: 'bombero@test.com',
        password: '123456',
        tipo: 'bombero'
    },
    {
        id: 4,
        nombre: 'Ana Policía',
        email: 'policia@test.com',
        password: '123456',
        tipo: 'policia'
    },
    {
        id: 5,
        nombre: 'Luis Paramédico',
        email: 'ambulancia@test.com',
        password: '123456',
        tipo: 'ambulancia'
    }
];

function login(email, password) {
    const user = window.users.find(u => u.email === email && u.password === password);
    if (user) {
        window.currentUser = user;
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