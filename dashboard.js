// ===== PRODUCTOS CON IMÁGENES EN CARPETA RAIZ =====
const products = [
    { id: 1, nombre: "Smartwatch T800 IWO Ultra Serie", categoria: "smartwatch", precio: 24.99, envio: true, imagen: "reloj.png", descripcion: "Reloj inteligente serie Ultra" },
    { id: 2, nombre: "Cable HDMI", categoria: "accesorios", precio: 4.99, envio: false, imagen: "hdmi.png", descripcion: "Cable HDMI compatible 4K" },
    { id: 3, nombre: "Termo LED Temperatura", categoria: "iluminacion", precio: 7.99, envio: false, imagen: "termo.png", descripcion: "Termo con pantalla LED indicadora" },
    { id: 4, nombre: "Audífonos B39M Orejas de Gato RGB", categoria: "audio", precio: 11.99, envio: true, imagen: "audifonos de gato.png", descripcion: "Audífonos con luces RGB y forma de orejas de gato" },
    { id: 5, nombre: "Audífonos Gamer Negro con Micrófono 3.5mm", categoria: "audio", precio: 11.99, envio: true, imagen: "Audífonos Gamer Negro con Micrófono.png", descripcion: "Audífonos con micrófono para PC/Laptop/PS4" },
    { id: 6, nombre: "Base Soporte para Celular Moto/Bicicleta", categoria: "accesorios", precio: 8.99, envio: false, imagen: "Base Soporte para Celular Moto.png", descripcion: "Sujetador universal para moto y bicicleta" },
    { id: 7, nombre: "Cautín Punta Cerámica", categoria: "herramientas", precio: 11.99, envio: false, imagen: "Cautín Punta Cerámica.png", descripcion: "Cautín para soldadura profesional" },
    { id: 8, nombre: "Multímetro Digital", categoria: "herramientas", precio: 11.99, envio: true, imagen: "Multímetro Digital.png", descripcion: "Multímetro para medir voltaje y corriente" },
    { id: 9, nombre: "Teclado RGB Gamer", categoria: "accesorios", precio: 14.99, envio: true, imagen: "Teclado RGB Gamer.png", descripcion: "Teclado mecánico con iluminación RGB" },
    { id: 10, nombre: "Cable Tipo C", categoria: "accesorios", precio: 0.99, envio: false, imagen: "Cable Tipo C.png", descripcion: "Cable USB Tipo C carga rápida" },
    { id: 11, nombre: "Kit de Destornillador Profesional", categoria: "herramientas", precio: 14.99, envio: true, imagen: "Kit de Destornillador Profesional.png", descripcion: "Kit de 60 piezas para reparación" },
    { id: 12, nombre: "Audífonos Bluetooth F9-TWS", categoria: "audio", precio: 10.99, envio: true, imagen: "Audífonos Bluetooth.png", descripcion: "Audífonos inalámbricos con estuche de carga" }
];

let currentUser = JSON.parse(localStorage.getItem('current_user'));
let cart = JSON.parse(localStorage.getItem('cart_meli')) || [];
let currentCategory = 'all';
let searchTerm = '';

// Verificar sesión
if (!currentUser) {
    window.location.href = 'index.html';
}

// Mostrar bienvenida
const welcomeText = document.getElementById('welcomeText');
if (welcomeText) {
    welcomeText.innerHTML = `${currentUser.nombre}, <strong>bienvenido a Computer Technology</strong> | ¡Envíos gratis en productos seleccionados!`;
}

// Mostrar info en menú lateral
const menuUserName = document.getElementById('menuUserName');
const menuUserEmail = document.getElementById('menuUserEmail');
if (menuUserName) menuUserName.textContent = currentUser.nombre;
if (menuUserEmail) menuUserEmail.textContent = currentUser.email;

// ===== FUNCIONES DEL CARRITO =====
function saveCart() {
    localStorage.setItem('cart_meli', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.cantidad, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.innerHTML = total;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.cantidad++;
    } else {
        cart.push({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            cantidad: 1,
            imagen: product.imagen,
            envio: product.envio
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('✅ Producto agregado al carrito');
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.cantidad += change;
        if (item.cantidad <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        saveCart();
        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

// ===== FUNCIONES DEL CARRITO LATERAL =====
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
}

function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

// ===== FUNCIONES DEL MENÚ LATERAL =====
function openMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    if (menu) menu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    if (menu) menu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== FUNCIÓN CHECKOUT =====
function checkout() {
    if (cart.length === 0) {
        showNotification('⚠️ Agrega productos al carrito primero');
        return;
    }
    
    localStorage.setItem('cart_meli', JSON.stringify(cart));
    closeCart();
    showNotification('🔄 Redirigiendo a métodos de pago...');
    
    setTimeout(() => {
        window.location.href = 'pagos.html';
    }, 500);
}

// ===== NOTIFICACIÓN =====
function showNotification(message) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #0A2B4E;
        color: white;
        padding: 12px 24px;
        border-radius: 40px;
        z-index: 1200;
        animation: fadeOut 2s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// ===== RENDER PRODUCTOS =====
function renderProducts() {
    let filtered = products;
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.categoria === currentCategory);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="no-results">No se encontraron productos</div>';
        return;
    }
    
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}" class="product-img" loading="lazy" onerror="this.src='https://placehold.co/300x200/0A192F/white?text=Producto'">
            <div class="product-info">
                <h3 class="product-title">${product.nombre}</h3>
                <div class="product-price">$${product.precio.toFixed(2)}</div>
                ${product.envio ? '<div class="product-shipping">🚚 Envío gratis</div>' : '<div class="product-shipping" style="color:#999;">📦 Envío con costo</div>'}
                <button class="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.id));
        });
    });
}

// ===== RENDER CARRITO =====
function updateCartUI() {
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    
    if (!cartBody) return;
    
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart-message">
                <span class="empty-icon">🛒</span>
                <p>Tu carrito está vacío</p>
                <small>¡Agrega productos para continuar!</small>
            </div>
        `;
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }
    
    cartBody.innerHTML = '';
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.imagen}" class="cart-item-img" alt="${item.nombre}" onerror="this.src='https://placehold.co/60x60/0A192F/white?text=?'">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.nombre}</div>
                <div class="cart-item-price">$${item.precio.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn dec" data-id="${item.id}">-</button>
                    <span class="item-quantity">${item.cantidad}</span>
                    <button class="quantity-btn inc" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">Eliminar</button>
                </div>
            </div>
        `;
        cartBody.appendChild(itemDiv);
    });
    
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) cartTotal.innerHTML = `$${getCartTotal().toFixed(2)}`;
    if (cartFooter) cartFooter.style.display = 'block';
    
    document.querySelectorAll('.dec').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1));
    });
    document.querySelectorAll('.inc').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1));
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
    });
}

// ===== BUSCAR =====
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchTerm = searchInput.value;
        renderProducts();
    }
}

// ===== CERRAR SESIÓN =====
function logout() {
    localStorage.removeItem('current_user');
    window.location.href = 'index.html';
}

// ===== EVENTOS =====
document.addEventListener('DOMContentLoaded', () => {
    // Menú hamburguesa
    const menuIcon = document.getElementById('menuIcon');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuChatBtn = document.getElementById('menuChatBtn');
    const menuLogoutBtn = document.getElementById('menuLogoutBtn');
    
    if (menuIcon) menuIcon.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
    
    if (menuChatBtn) {
        menuChatBtn.addEventListener('click', () => {
            showNotification('💬 Un agente se conectará contigo en breve');
            closeMenu();
        });
    }
    
    if (menuLogoutBtn) menuLogoutBtn.addEventListener('click', logout);
    
    // Carrito
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    
    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeCart);
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    
    // Búsqueda
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // Categorías
    document.querySelectorAll('.category').forEach(cat => {
        cat.addEventListener('click', () => {
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            cat.classList.add('active');
            currentCategory = cat.dataset.cat;
            renderProducts();
        });
    });
    
    // Inicializar
    renderProducts();
    updateCartCount();
    updateCartUI();
});

console.log('✅ Dashboard cargado correctamente');
console.log('📦 Productos disponibles:', products.length);