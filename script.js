const mainBox = document.querySelector('.main-box');
const btnRegistro = document.getElementById('btnRegistroPanel');
const btnLogin = document.getElementById('btnLoginPanel');
const loginBtn = document.getElementById('btnLogin');
const registerBtn = document.getElementById('btnRegister');

// Obtener los inputs
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const regNombre = document.getElementById('regNombre');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');

// Base de datos local (localStorage)
const DB_USERS = 'users_db';

// Inicializar usuarios si no existen
if (!localStorage.getItem(DB_USERS)) {
    const users = [
        {
            id: 1,
            nombre: 'Usuario Demo',
            email: 'demo@computer.com',
            password: '123456'
        }
    ];
    localStorage.setItem(DB_USERS, JSON.stringify(users));
}

// Funciones de la "base de datos" local
function getUsers() {
    return JSON.parse(localStorage.getItem(DB_USERS)) || [];
}

function saveUsers(users) {
    localStorage.setItem(DB_USERS, JSON.stringify(users));
}

// Mostrar mensajes
function showMessage(elementId, message, isError = true) {
    const msgDiv = document.getElementById(elementId);
    if (msgDiv) {
        msgDiv.textContent = message;
        msgDiv.className = `message ${isError ? 'error' : 'success'}`;
        
        setTimeout(() => {
            msgDiv.textContent = '';
            msgDiv.className = 'message';
        }, 3000);
    }
}

// ========== REGISTRO ==========
registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const nombre = regNombre ? regNombre.value.trim() : '';
    const email = regEmail ? regEmail.value.trim() : '';
    const password = regPassword ? regPassword.value : '';

    if (!nombre || !email || !password) {
        showMessage('registerMessage', '⚠️ Todos los campos son obligatorios', true);
        return;
    }

    const users = getUsers();
    
    // Verificar si el email ya existe
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        showMessage('registerMessage', '❌ El correo electrónico ya está registrado', true);
        return;
    }

    // Crear nuevo usuario
    const newUser = {
        id: users.length + 1,
        nombre: nombre,
        email: email,
        password: password
    };
    
    users.push(newUser);
    saveUsers(users);
    
    showMessage('registerMessage', '✅ ¡Registro exitoso! Ahora inicia sesión', false);
    
    // Limpiar campos
    if (regNombre) regNombre.value = '';
    if (regEmail) regEmail.value = '';
    if (regPassword) regPassword.value = '';
    
    // Cambiar a login después de 1.5 segundos
    setTimeout(() => {
        showLogin();
    }, 1500);
});

// ========== INICIO DE SESIÓN ==========
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = loginEmail ? loginEmail.value.trim() : '';
    const password = loginPassword ? loginPassword.value : '';

    if (!email || !password) {
        showMessage('loginMessage', '⚠️ Correo y contraseña son obligatorios', true);
        return;
    }

    const users = getUsers();
    
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        showMessage('loginMessage', `✅ ¡Bienvenido ${user.nombre}! Inicio de sesión exitoso`, false);
        
        // Guardar sesión actual
        localStorage.setItem('current_user', JSON.stringify({
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }));
        
        // Limpiar campos
        if (loginEmail) loginEmail.value = '';
        if (loginPassword) loginPassword.value = '';
        
        console.log('Usuario logueado:', user);
    } else {
        showMessage('loginMessage', '❌ Correo o contraseña incorrectos', true);
    }
});

// ========== EFECTO SLIDE ==========
function showRegister() {
    mainBox.classList.add('slide-active');
}

function showLogin() {
    mainBox.classList.remove('slide-active');
}

if (btnRegistro) btnRegistro.addEventListener('click', showRegister);
if (btnLogin) btnLogin.addEventListener('click', showLogin);

// Permitir enviar con Enter
if (loginPassword) {
    loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });
}
if (regPassword) {
    regPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') registerBtn.click();
    });
}

// Mostrar estado actual en consola
console.log('Base de datos offline inicializada con:', getUsers());