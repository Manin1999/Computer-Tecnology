// ===== ELEMENTOS DEL DOM =====
const tabLogin = document.getElementById('tabLoginBtn');
const tabRegister = document.getElementById('tabRegisterBtn');
const loginWrapper = document.getElementById('loginWrapper');
const registerWrapper = document.getElementById('registerWrapper');
const loginSubmit = document.getElementById('loginSubmit');
const registerSubmit = document.getElementById('registerSubmit');

// Inputs
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const regNombre = document.getElementById('regNombre');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');

// ===== BASE DE DATOS LOCAL =====
const DB_USERS = 'users_db';

// Inicializar usuario demo
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

// Funciones de BD
function getUsers() {
    return JSON.parse(localStorage.getItem(DB_USERS)) || [];
}

function saveUsers(users) {
    localStorage.setItem(DB_USERS, JSON.stringify(users));
}

// ===== MOSTRAR MENSAJES =====
function showMessage(elementId, message, isError = true) {
    const msgDiv = document.getElementById(elementId);
    if (msgDiv) {
        msgDiv.textContent = message;
        msgDiv.className = `message-area ${isError ? 'error' : 'success'}`;
        
        setTimeout(() => {
            msgDiv.textContent = '';
            msgDiv.className = 'message-area';
        }, 3000);
    }
}

// ===== CAMBIAR ENTRE PESTAÑAS =====
function setActiveTab(tab) {
    if (tab === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginWrapper.classList.add('active');
        registerWrapper.classList.remove('active');
    } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerWrapper.classList.add('active');
        loginWrapper.classList.remove('active');
    }
}

tabLogin.addEventListener('click', () => setActiveTab('login'));
tabRegister.addEventListener('click', () => setActiveTab('register'));

// ===== REGISTRO =====
registerSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    
    const nombre = regNombre.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value;

    if (!nombre || !email || !password) {
        showMessage('registerMessage', '⚠️ Todos los campos son obligatorios', true);
        return;
    }

    const users = getUsers();
    
    if (users.some(u => u.email === email)) {
        showMessage('registerMessage', '❌ Este correo ya está registrado', true);
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
    
    // Limpiar campos
    regNombre.value = '';
    regEmail.value = '';
    regPassword.value = '';
    
    // Cambiar a login después de 1.5 segundos
    setTimeout(() => {
        setActiveTab('login');
    }, 1500);
});

// ===== INICIO DE SESIÓN =====
loginSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        showMessage('loginMessage', '⚠️ Correo y contraseña son obligatorios', true);
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        showMessage('loginMessage', `✅ ¡Bienvenido ${user.nombre}! Redirigiendo...`, false);
        
        // Guardar sesión
        localStorage.setItem('current_user', JSON.stringify({
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }));
        
        // Limpiar campos
        loginEmail.value = '';
        loginPassword.value = '';
        
        // Redirigir al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showMessage('loginMessage', '❌ Correo o contraseña incorrectos', true);
    }
});

// Permitir enviar con Enter
loginPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginSubmit.click();
});
regPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') registerSubmit.click();
});

console.log('✅ Sistema listo. Usuario demo: demo@computer.com / 123456');