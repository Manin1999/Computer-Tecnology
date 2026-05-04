const mainBox = document.querySelector('.main-box');
const btnRegistro = document.getElementById('btnRegistroPanel');
const btnLoginPanel = document.getElementById('btnLoginPanel');
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
    console.log('✅ Usuario demo creado');
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
        msgDiv.className = isError ? 'error' : 'success';
        
        setTimeout(() => {
            msgDiv.textContent = '';
            msgDiv.className = '';
        }, 3000);
    }
}

// ========== REDIRIGIR A PÁGINA CENTRAL ==========
function redirectToDashboard(user) {
    console.log('🔵 Redirigiendo a dashboard con usuario:', user);
    localStorage.setItem('current_user', JSON.stringify(user));
    window.location.href = 'dashboard.html';
}

// ========== REGISTRO ==========
if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🟢 Registro clickeado');
        
        const nombre = regNombre ? regNombre.value.trim() : '';
        const email = regEmail ? regEmail.value.trim() : '';
        const password = regPassword ? regPassword.value : '';

        if (!nombre || !email || !password) {
            showMessage('registerMessage', '⚠️ Todos los campos son obligatorios', true);
            return;
        }

        const users = getUsers();
        
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            showMessage('registerMessage', '❌ El correo electrónico ya está registrado', true);
            return;
        }

        const newUser = {
            id: users.length + 1,
            nombre: nombre,
            email: email,
            password: password
        };
        
        users.push(newUser);
        saveUsers(users);
        
        showMessage('registerMessage', '✅ ¡Registro exitoso! Ahora inicia sesión', false);
        
        if (regNombre) regNombre.value = '';
        if (regEmail) regEmail.value = '';
        if (regPassword) regPassword.value = '';
        
        setTimeout(() => {
            showLogin();
        }, 1500);
    });
}

// ========== INICIO DE SESIÓN ==========
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🔵 Login clickeado');
        
        const email = loginEmail ? loginEmail.value.trim() : '';
        const password = loginPassword ? loginPassword.value : '';

        if (!email || !password) {
            showMessage('loginMessage', '⚠️ Correo y contraseña son obligatorios', true);
            return;
        }

        const users = getUsers();
        console.log('📋 Usuarios en BD:', users);
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            console.log('✅ Usuario encontrado:', user);
            showMessage('loginMessage', `✅ ¡Bienvenido ${user.nombre}! Redirigiendo...`, false);
            
            setTimeout(() => {
                redirectToDashboard({
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email
                });
            }, 1000);
        } else {
            console.log('❌ Usuario no encontrado');
            showMessage('loginMessage', '❌ Correo o contraseña incorrectos', true);
        }
    });
}

// ========== EFECTO SLIDE ==========
function showRegister() {
    if (mainBox) mainBox.classList.add('slide-active');
}

function showLogin() {
    if (mainBox) mainBox.classList.remove('slide-active');
}

if (btnRegistro) btnRegistro.addEventListener('click', showRegister);
if (btnLoginPanel) btnLoginPanel.addEventListener('click', showLogin);

// Enter para enviar
if (loginPassword) {
    loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && loginBtn) loginBtn.click();
    });
}
if (regPassword) {
    regPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && registerBtn) registerBtn.click();
    });
}

console.log('🚀 Script cargado correctamente');
console.log('📊 Usuarios en BD:', getUsers());