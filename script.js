// ========== BASE DE DATOS OFFLINE ==========
const DB_USERS = 'users_db';

// Inicializar usuarios
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

function getUsers() {
    return JSON.parse(localStorage.getItem(DB_USERS)) || [];
}

function saveUsers(users) {
    localStorage.setItem(DB_USERS, JSON.stringify(users));
}

function showMessage(elementId, message, isError = true, isMobile = false) {
    const msgDiv = document.getElementById(elementId);
    if (msgDiv) {
        msgDiv.textContent = message;
        msgDiv.className = `${isMobile ? 'message-mobile' : 'message'} ${isError ? 'error' : 'success'}`;
        setTimeout(() => {
            msgDiv.textContent = '';
            msgDiv.className = isMobile ? 'message-mobile' : 'message';
        }, 3000);
    }
}

function redirectToDashboard(user) {
    localStorage.setItem('current_user', JSON.stringify(user));
    window.location.href = 'dashboard.html';
}

// ========== VERSIÓN ESCRITORIO ==========
if (window.innerWidth > 768) {
    const mainBox = document.querySelector('.main-box');
    const btnRegistro = document.getElementById('btnRegistroPanel');
    const btnLoginPanel = document.getElementById('btnLoginPanel');
    const loginBtn = document.getElementById('btnLogin');
    const registerBtn = document.getElementById('btnRegisterDesktop');

    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const regNombre = document.getElementById('regNombreDesktop');
    const regEmail = document.getElementById('regEmailDesktop');
    const regPassword = document.getElementById('regPasswordDesktop');

    function showRegister() {
        mainBox.classList.add('slide-active');
    }

    function showLogin() {
        mainBox.classList.remove('slide-active');
    }

    if (btnRegistro) btnRegistro.addEventListener('click', showRegister);
    if (btnLoginPanel) btnLoginPanel.addEventListener('click', showLogin);

    // Registro escritorio
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const nombre = regNombre ? regNombre.value.trim() : '';
            const email = regEmail ? regEmail.value.trim() : '';
            const password = regPassword ? regPassword.value : '';

            if (!nombre || !email || !password) {
                showMessage('registerMessageDesktop', '⚠️ Todos los campos son obligatorios', true);
                return;
            }

            const users = getUsers();
            if (users.some(user => user.email === email)) {
                showMessage('registerMessageDesktop', '❌ El correo ya está registrado', true);
                return;
            }

            users.push({ id: users.length + 1, nombre, email, password });
            saveUsers(users);
            showMessage('registerMessageDesktop', '✅ ¡Registro exitoso!', false);
            
            if (regNombre) regNombre.value = '';
            if (regEmail) regEmail.value = '';
            if (regPassword) regPassword.value = '';
            
            setTimeout(() => showLogin(), 1500);
        });
    }

    // Login escritorio
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = loginEmail ? loginEmail.value.trim() : '';
            const password = loginPassword ? loginPassword.value : '';

            if (!email || !password) {
                showMessage('loginMessage', '⚠️ Correo y contraseña requeridos', true);
                return;
            }

            const user = getUsers().find(u => u.email === email && u.password === password);
            if (user) {
                showMessage('loginMessage', `✅ ¡Bienvenido ${user.nombre}!`, false);
                setTimeout(() => redirectToDashboard(user), 1000);
            } else {
                showMessage('loginMessage', '❌ Credenciales incorrectas', true);
            }
        });
    }
}

// ========== VERSIÓN MÓVIL ==========
if (window.innerWidth <= 768) {
    // Elementos móviles
    const mobileLoginTab = document.getElementById('mobileLoginTab');
    const mobileRegisterTab = document.getElementById('mobileRegisterTab');
    const mobileLoginForm = document.getElementById('mobileLoginForm');
    const mobileRegisterForm = document.getElementById('mobileRegisterForm');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    
    const mobileEmail = document.getElementById('mobileEmail');
    const mobilePassword = document.getElementById('mobilePassword');
    const mobileNombre = document.getElementById('mobileNombre');
    const mobileRegEmail = document.getElementById('mobileRegEmail');
    const mobileRegPassword = document.getElementById('mobileRegPassword');

    // Cambiar entre tabs
    if (mobileLoginTab) {
        mobileLoginTab.addEventListener('click', () => {
            mobileLoginTab.classList.add('active');
            mobileRegisterTab.classList.remove('active');
            mobileLoginForm.classList.remove('hidden');
            mobileRegisterForm.classList.add('hidden');
        });
    }

    if (mobileRegisterTab) {
        mobileRegisterTab.addEventListener('click', () => {
            mobileRegisterTab.classList.add('active');
            mobileLoginTab.classList.remove('active');
            mobileLoginForm.classList.add('hidden');
            mobileRegisterForm.classList.remove('hidden');
        });
    }

    // Registro móvil
    if (mobileRegisterBtn) {
        mobileRegisterBtn.addEventListener('click', () => {
            const nombre = mobileNombre ? mobileNombre.value.trim() : '';
            const email = mobileRegEmail ? mobileRegEmail.value.trim() : '';
            const password = mobileRegPassword ? mobileRegPassword.value : '';

            if (!nombre || !email || !password) {
                showMessage('mobileRegisterMessage', '⚠️ Completa todos los campos', true, true);
                return;
            }

            const users = getUsers();
            if (users.some(user => user.email === email)) {
                showMessage('mobileRegisterMessage', '❌ Este correo ya está registrado', true, true);
                return;
            }

            users.push({ id: users.length + 1, nombre, email, password });
            saveUsers(users);
            showMessage('mobileRegisterMessage', '✅ ¡Cuenta creada! Ahora inicia sesión', false, true);
            
            if (mobileNombre) mobileNombre.value = '';
            if (mobileRegEmail) mobileRegEmail.value = '';
            if (mobileRegPassword) mobileRegPassword.value = '';
            
            // Cambiar a login
            setTimeout(() => {
                mobileLoginTab.click();
            }, 1500);
        });
    }

    // Login móvil
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', () => {
            const email = mobileEmail ? mobileEmail.value.trim() : '';
            const password = mobilePassword ? mobilePassword.value : '';

            if (!email || !password) {
                showMessage('mobileLoginMessage', '⚠️ Correo y contraseña requeridos', true, true);
                return;
            }

            const user = getUsers().find(u => u.email === email && u.password === password);
            if (user) {
                showMessage('mobileLoginMessage', `✅ ¡Bienvenido ${user.nombre}!`, false, true);
                setTimeout(() => redirectToDashboard(user), 1000);
            } else {
                showMessage('mobileLoginMessage', '❌ Correo o contraseña incorrectos', true, true);
            }
        });
    }
}

// Permitir enviar con Enter en móvil
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (window.innerWidth <= 768) {
            if (document.getElementById('mobileLoginForm') && !document.getElementById('mobileLoginForm').classList.contains('hidden')) {
                document.getElementById('mobileLoginBtn').click();
            } else {
                document.getElementById('mobileRegisterBtn').click();
            }
        }
    }
});