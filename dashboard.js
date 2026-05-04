// Obtener usuario de localStorage
const currentUser = JSON.parse(localStorage.getItem('current_user'));

// Verificar si hay usuario logueado
if (!currentUser) {
    // Si no hay usuario, redirigir al login
    window.location.href = 'index.html';
}

// Mostrar información del usuario
document.getElementById('userNombre').textContent = currentUser.nombre;
document.getElementById('userEmail').textContent = currentUser.email;
document.getElementById('userId').textContent = currentUser.id;
document.getElementById('welcomeTitle').textContent = `¡Hola, ${currentUser.nombre}!`;

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    // Eliminar usuario de localStorage
    localStorage.removeItem('current_user');
    // Redirigir al login
    window.location.href = 'index.html';
});