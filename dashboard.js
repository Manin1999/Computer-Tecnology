// ===== PRODUCTOS =====
const products = [
    { id: 1, nombre: "Laptop Gaming ASUS ROG", categoria: "laptops", precio: 1299.99, envio: true, imagen: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300", descripcion: "Intel i7, RTX 4060, 16GB RAM, 1TB SSD" },
    { id: 2, nombre: "Laptop HP Pavilion", categoria: "laptops", precio: 899.99, envio: true, imagen: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300", descripcion: "AMD Ryzen 5, 8GB RAM, 512GB SSD" },
    { id: 3, nombre: "Teclado Mecánico RGB", categoria: "perifericos", precio: 89.99, envio: false, imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300", descripcion: "Switch Blue, iluminación RGB" },
    { id: 4, nombre: "Mouse Gamer Logitech", categoria: "perifericos", precio: 49.99, envio: true, imagen: "https://images.unsplash.com/photo-1527864550417-7fd91ae51a46?w=300", descripcion: "Sensor 16000 DPI, 6 botones" },
    { id: 5, nombre: "Monitor Samsung 27''", categoria: "monitores", precio: 349.99, envio: true, imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300", descripcion: "1080p, 144Hz, 1ms" },
    { id: 6, nombre: "Monitor LG 4K", categoria: "monitores", precio: 449.99, envio: true, imagen: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=300", descripcion: "4K UHD, IPS, HDR10" },
    { id: 7, nombre: "SSD Kingston 1TB", categoria: "almacenamiento", precio: 119.99, envio: false, imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300", descripcion: "NVMe, lectura 3500MB/s" },
    { id: 8, nombre: "Disco Duro Externo 2TB", categoria: "almacenamiento", precio: 89.99, envio: true, imagen: "https://images.unsplash.com/photo-1587202372775-e229f172a375?w=300", descripcion: "USB 3.0, portátil" },
    { id: 9, nombre: "Auriculares HyperX", categoria: "audio", precio: 79.99, envio: true, imagen: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300", descripcion: "Sonido 7.1, micrófono noise-cancelling" },
    { id: 10, nombre: "Parlante Bluetooth", categoria: "audio", precio: 59.99, envio: false, imagen: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300", descripcion: "Portátil, 20W, resistente al agua" }
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

// ===== FUNCIÓN CHECKOUT (REDIRIGE A PAGOS) =====
function checkout() {
    console.log('🛒 Botón Comprar clickeado');
    console.log('📦 Carrito actual:', cart);
    
    if (cart.length === 0) {
        showNotification('⚠️ Agrega productos al carrito primero');
        return;
    }
    
    // Guardar carrito antes de redirigir
    localStorage.setItem('cart_meli', JSON.stringify(cart));
    console.log('✅ Carrito guardado correctamente');
    
    // Cerrar carrito
    closeCart();
    
    // Mostrar notificación
    showNotification('🔄 Redirigiendo a métodos de pago...');
    
    // Redirigir a la página de pagos
    setTimeout(() => {
        console.log('🔀 Redirigiendo a pagos.html');
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
            <img src="${product.imagen}" alt="${product.nombre}" class="product-img">
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

// ===== RENDER CARRITO LATERAL =====
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
            <img src="${item.imagen}" class="cart-item-img" alt="${item.nombre}">
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

// ===== EVENTOS =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard iniciado');
    
    // Evento del carrito
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    
    // Evento cerrar carrito
    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    
    // Evento overlay
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeCart);
    
    // Evento checkout (IMPORTANTE: Botón Comprar ahora)
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
        console.log('✅ Botón Comprar ahora conectado correctamente');
    } else {
        console.log('❌ Botón Comprar ahora NO encontrado');
    }
    
    // Evento búsqueda
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // Evento categorías
    document.querySelectorAll('.category').forEach(cat => {
        cat.addEventListener('click', () => {
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            cat.classList.add('active');
            currentCategory = cat.dataset.cat;
            renderProducts();
        });
    });
    
    // Evento cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('current_user');
            window.location.href = 'index.html';
        });
    }
    
    // Inicializar
    renderProducts();
    updateCartCount();
    updateCartUI();
});

// Agregar animación para el toast
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        15% { opacity: 1; transform: translateX(-50%) translateY(0); }
        85% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
    .no-results {
        text-align: center;
        padding: 60px;
        background: white;
        border-radius: 12px;
        grid-column: 1/-1;
    }
`;
document.head.appendChild(style);

console.log('✅ Dashboard.js cargado correctamente');
console.log('📦 Carrito actual:', cart);