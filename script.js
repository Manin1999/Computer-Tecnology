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

// ========== REDIRIGIR A PÁGINA CENTRAL ==========
function redirectToDashboard(user) {
    localStorage.setItem('current_user', JSON.stringify(user));
    window.location.href = 'dashboard.html';
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
        // Actualizar botones móviles si existen
        updateMobileToggle('login');
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
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        showMessage('loginMessage', `✅ ¡Bienvenido ${user.nombre}! Redirigiendo...`, false);
        
        setTimeout(() => {
            redirectToDashboard({
                id: user.id,
                nombre: user.nombre,
                email: user.email
            });
        }, 1000);
    } else {
        showMessage('loginMessage', '❌ Correo o contraseña incorrectos', true);
    }
});

// ========== EFECTO SLIDE ==========
function showRegister() {
    mainBox.classList.add('slide-active');
    updateMobileToggle('register');
}

function showLogin() {
    mainBox.classList.remove('slide-active');
    updateMobileToggle('login');
}

if (btnRegistro) btnRegistro.addEventListener('click', showRegister);
if (btnLoginPanel) btnLoginPanel.addEventListener('click', showLogin);

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

// ========== BOTONES TÁCTILES PARA MÓVIL ==========
function updateMobileToggle(activeForm = 'login') {
    const loginToggle = document.querySelector('.mobile-toggle-btn-login');
    const registerToggle = document.querySelector('.mobile-toggle-btn-register');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginToggle && registerToggle) {
        if (activeForm === 'login') {
            loginToggle.classList.add('active');
            registerToggle.classList.remove('active');
            if (loginForm) loginForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
        } else {
            loginToggle.classList.remove('active');
            registerToggle.classList.add('active');
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
        }
    }
}

function addMobileToggle() {
    // Verificar si es móvil
    if (window.innerWidth <= 768) {
        const formsPanel = document.querySelector('.forms-panel');
        const loginForm = document.querySelector('#loginForm');
        const registerForm = document.querySelector('#registerForm');
        
        // Verificar si ya existen los botones
        if (!document.querySelector('.mobile-toggle')) {
            // Crear contenedor de botones
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'mobile-toggle';
            
            // Botón Iniciar Sesión
            const loginToggle = document.createElement('button');
            loginToggle.textContent = 'Iniciar Sesión';
            loginToggle.className = 'mobile-toggle-btn mobile-toggle-btn-login active';
            loginToggle.onclick = () => {
                if (loginForm) loginForm.style.display = 'block';
                if (registerForm) registerForm.style.display = 'none';
                loginToggle.classList.add('active');
                registerToggle.classList.remove('active');
                if (mainBox) mainBox.classList.remove('slide-active');
            };
            
            // Botón Registrarse
            const registerToggle = document.createElement('button');
            registerToggle.textContent = 'Registrarse';
            registerToggle.className = 'mobile-toggle-btn mobile-toggle-btn-register';
            registerToggle.onclick = () => {
                if (loginForm) loginForm.style.display = 'none';
                if (registerForm) registerForm.style.display = 'block';
                registerToggle.classList.add('active');
                loginToggle.classList.remove('active');
                if (mainBox) mainBox.classList.add('slide-active');
            };
            
            toggleContainer.appendChild(loginToggle);
            toggleContainer.appendChild(registerToggle);
            
            // Insertar al inicio del forms-panel
            if (formsPanel) {
                formsPanel.insertBefore(toggleContainer, formsPanel.firstChild);
            }
        }
    } else {
        // En escritorio, eliminar los botones móviles si existen
        const mobileToggle = document.querySelector('.mobile-toggle');
        if (mobileToggle) {
            mobileToggle.remove();
        }
        // Restaurar visibilidad normal
        const loginForm = document.querySelector('#loginForm');
        const registerForm = document.querySelector('#registerForm');
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
    }
}

// Ejecutar al cargar y al redimensionar
addMobileToggle();
window.addEventListener('resize', addMobileToggle);

// Mostrar estado actual en consola
console.log('Base de datos offline inicializada con:', getUsers());