// Obtener carrito y usuario
let cart = JSON.parse(localStorage.getItem('cart_meli')) || [];
let currentUser = JSON.parse(localStorage.getItem('current_user'));

// Variable para almacenar el método de envío seleccionado
let selectedShipping = null;
let shippingCost = 0;

// Precios de envío
const shippingPrices = {
    delivery: 5.00,
    mrw: 8.00,
    internacional: 35.00  // Precio base, puede variar según país
};

// Verificar sesión
if (!currentUser) {
    window.location.href = 'index.html';
}

// Verificar carrito vacío
if (cart.length === 0) {
    window.location.href = 'dashboard.html';
}

// ===== FUNCIONES =====
function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

function getCartTotal() {
    return getCartSubtotal() + shippingCost;
}

function renderOrderSummary() {
    const orderBody = document.getElementById('orderBody');
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderTotal = document.getElementById('orderTotal');
    const shippingCostRow = document.getElementById('shippingCostRow');
    const shippingCostSpan = document.getElementById('shippingCost');
    
    orderBody.innerHTML = '';
    
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <img src="${item.imagen}" class="order-item-img" alt="${item.nombre}">
            <div class="order-item-details">
                <div class="order-item-title">${item.nombre}</div>
                <div class="order-item-price">$${item.precio.toFixed(2)}</div>
                <div class="order-item-quantity">Cantidad: ${item.cantidad}</div>
            </div>
        `;
        orderBody.appendChild(itemDiv);
    });
    
    const subtotal = getCartSubtotal();
    orderSubtotal.innerHTML = `$${subtotal.toFixed(2)}`;
    
    if (selectedShipping) {
        shippingCostRow.style.display = 'flex';
        shippingCostSpan.innerHTML = `$${shippingCost.toFixed(2)}`;
    } else {
        shippingCostRow.style.display = 'none';
    }
    
    orderTotal.innerHTML = `$${getCartTotal().toFixed(2)}`;
}

function updateShippingDetails() {
    const selectedShippingInfo = document.getElementById('selectedShippingInfo');
    
    if (selectedShipping === 'delivery') {
        selectedShippingInfo.innerHTML = '🚗 Delivery Nacional (1-3 días)';
    } else if (selectedShipping === 'mrw') {
        selectedShippingInfo.innerHTML = '📦 MRW Venezuela (2-5 días) - Con número de guía';
    } else if (selectedShipping === 'internacional') {
        selectedShippingInfo.innerHTML = '✈️ Envío Internacional (7-15 días) - Seguimiento incluido';
    } else {
        selectedShippingInfo.innerHTML = '';
    }
    
    renderOrderSummary();
}

function toggleOrderSidebar() {
    document.getElementById('orderSidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

function closeOrderSidebar() {
    document.getElementById('orderSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

// ===== SELECCIONAR MÉTODO DE ENVÍO =====
function selectShipping(method) {
    // Remover selección anterior
    document.querySelectorAll('.shipping-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleccionar nuevo método
    const selectedCard = document.querySelector(`.shipping-card[data-shipping="${method}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    selectedShipping = method;
    shippingCost = shippingPrices[method];
    
    updateShippingDetails();
    showNotification(`✅ Envío seleccionado: ${getShippingName(method)}`);
}

function getShippingName(method) {
    const names = {
        delivery: 'Delivery Nacional',
        mrw: 'MRW Venezuela',
        internacional: 'Envío Internacional'
    };
    return names[method];
}

// ===== MÉTODOS DE PAGO =====
function showPaymentDetails(method) {
    const modal = document.getElementById('paymentModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('paymentDetailsBody');
    
    // Verificar que se haya seleccionado un método de envío
    if (!selectedShipping) {
        showNotification('⚠️ Primero selecciona un método de envío', true);
        return;
    }
    
    let content = '';
    
    switch(method) {
        case 'bancovenezuela':
            modalTitle.textContent = 'Transferencia Banco de Venezuela';
            content = `
                <div class="bank-info">
                    <h3>Datos para la transferencia</h3>
                    <div class="info-box">
                        <p><strong>Banco:</strong> Banco de Venezuela</p>
                        <p><strong>Tipo de cuenta:</strong> Cuenta Corriente</p>
                        <p><strong>Número de cuenta:</strong> 0102-1234-5678-90123456</p>
                        <p><strong>CI/RIF:</strong> J-12345678-0</p>
                        <p><strong>Beneficiario:</strong> Computer Technology C.A.</p>
                        <p><strong>Monto a pagar:</strong> <strong style="color:#0A2B4E">$${getCartTotal().toFixed(2)}</strong></p>
                        <button class="copy-btn" onclick="copyToClipboard('0102-1234-5678-90123456')">📋 Copiar número de cuenta</button>
                    </div>
                    <div class="form-group">
                        <label>Número de referencia de la transferencia</label>
                        <input type="text" id="referencia" placeholder="Ingresa el número de referencia">
                    </div>
                    <div class="form-group">
                        <label>Nombre del titular de la cuenta</label>
                        <input type="text" id="titular" placeholder="Nombre completo">
                    </div>
                    <div class="form-group">
                        <label>Dirección de envío</label>
                        <textarea id="direccion" rows="2" placeholder="Ingresa tu dirección completa para el envío"></textarea>
                    </div>
                    <button class="pay-btn" onclick="confirmPayment('transferencia')">Confirmar pago</button>
                </div>
            `;
            break;
            
        case 'pagomovil':
            modalTitle.textContent = 'Pago Móvil';
            content = `
                <div class="movil-info">
                    <h3>Datos para Pago Móvil</h3>
                    <div class="info-box">
                        <p><strong>Banco:</strong> Banco de Venezuela</p>
                        <p><strong>Teléfono:</strong> 0412-1234567</p>
                        <p><strong>CI/RIF:</strong> V-12345678</p>
                        <p><strong>Beneficiario:</strong> Computer Technology</p>
                        <p><strong>Monto a pagar:</strong> <strong style="color:#0A2B4E">$${getCartTotal().toFixed(2)}</strong></p>
                        <button class="copy-btn" onclick="copyToClipboard('0412-1234567')">📋 Copiar número de teléfono</button>
                    </div>
                    <div class="form-group">
                        <label>Número de referencia del Pago Móvil</label>
                        <input type="text" id="referencia" placeholder="Ingresa el número de referencia">
                    </div>
                    <div class="form-group">
                        <label>Nombre del pagador</label>
                        <input type="text" id="pagador" placeholder="Nombre completo">
                    </div>
                    <div class="form-group">
                        <label>Dirección de envío</label>
                        <textarea id="direccion" rows="2" placeholder="Ingresa tu dirección completa para el envío"></textarea>
                    </div>
                    <button class="pay-btn" onclick="confirmPayment('pagomovil')">Confirmar pago</button>
                </div>
            `;
            break;
            
        case 'binance':
            modalTitle.textContent = 'Binance - Criptomonedas';
            content = `
                <div class="crypto-info">
                    <h3>Datos para transferencia en Binance</h3>
                    <div class="info-box">
                        <p><strong>Monedas aceptadas:</strong> USDT (TRC20), BTC, BNB</p>
                        <p><strong>Wallet USDT (TRC20):</strong> TXmqZ4yKxYcL5nVp7QwR2tY8uI3oE6aF9bC</p>
                        <p><strong>Wallet BTC:</strong> 1A2b3C4d5E6f7G8h9I0jK1lL2mM3nN4oO5pP</p>
                        <p><strong>Monto en USD:</strong> <strong style="color:#0A2B4E">$${getCartTotal().toFixed(2)}</strong></p>
                        <button class="copy-btn" onclick="copyToClipboard('TXmqZ4yKxYcL5nVp7QwR2tY8uI3oE6aF9bC')">📋 Copiar wallet USDT</button>
                    </div>
                    <div class="form-group">
                        <label>ID de la transacción (TxID)</label>
                        <input type="text" id="txid" placeholder="Ingresa el TxID de Binance">
                    </div>
                    <div class="form-group">
                        <label>Tu nombre de usuario en Binance</label>
                        <input type="text" id="username" placeholder="Usuario Binance">
                    </div>
                    <div class="form-group">
                        <label>Dirección de envío</label>
                        <textarea id="direccion" rows="2" placeholder="Ingresa tu dirección completa para el envío"></textarea>
                    </div>
                    <button class="pay-btn" onclick="confirmPayment('binance')">Confirmar pago</button>
                </div>
            `;
            break;
            
        case 'paypal':
            modalTitle.textContent = 'PayPal';
            content = `
                <div class="paypal-info">
                    <h3>Datos para pago con PayPal</h3>
                    <div class="info-box">
                        <p><strong>Correo PayPal:</strong> ventas@computertechnology.com</p>
                        <p><strong>Monto a pagar:</strong> <strong style="color:#0A2B4E">$${getCartTotal().toFixed(2)}</strong></p>
                        <button class="copy-btn" onclick="copyToClipboard('ventas@computertechnology.com')">📋 Copiar correo PayPal</button>
                    </div>
                    <div class="form-group">
                        <label>Tu correo PayPal</label>
                        <input type="email" id="paypalEmail" placeholder="tu@email.com">
                    </div>
                    <div class="form-group">
                        <label>ID de transacción PayPal</label>
                        <input type="text" id="transactionId" placeholder="ID de la transacción">
                    </div>
                    <div class="form-group">
                        <label>Dirección de envío</label>
                        <textarea id="direccion" rows="2" placeholder="Ingresa tu dirección completa para el envío"></textarea>
                    </div>
                    <button class="pay-btn" onclick="confirmPayment('paypal')">Confirmar pago</button>
                </div>
            `;
            break;
            
        case 'debito':
            modalTitle.textContent = 'Tarjeta de Débito';
            content = `
                <div class="card-info">
                    <h3>Datos de tu tarjeta de débito</h3>
                    <div class="form-group">
                        <label>Número de tarjeta</label>
                        <input type="text" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" maxlength="19">
                    </div>
                    <div class="form-group">
                        <label>Nombre del titular</label>
                        <input type="text" id="cardName" placeholder="Como aparece en la tarjeta">
                    </div>
                    <div class="form-group">
                        <label>Fecha de expiración</label>
                        <input type="text" id="expiry" placeholder="MM/AA">
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="password" id="cvv" placeholder="***" maxlength="4">
                    </div>
                    <div class="form-group">
                        <label>Dirección de envío</label>
                        <textarea id="direccion" rows="2" placeholder="Ingresa tu dirección completa para el envío"></textarea>
                    </div>
                    <div class="info-box">
                        <p><strong>Monto a pagar:</strong> <strong style="color:#0A2B4E">$${getCartTotal().toFixed(2)}</strong></p>
                    </div>
                    <button class="pay-btn" onclick="confirmPayment('tarjeta')">Pagar</button>
                </div>
            `;
            break;
            
        case 'credito':
            modalTitle.textContent = 'Tarjeta de Crédito';
            content = `
                <div class="card-info">
                    <h3>Datos de tu tarjeta de crédito</h3>
                    <div class="form-group">
                        <label>Número de tarjeta</label>
                        <input type="text" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" maxlength="19">
                    </div>
                    <div class="form-group">
                        <label>Tipo de tarjeta</label>
                        <select id="cardType">
                            <option value="visa">Visa</option>
                            <option value="mastercard">Mastercard</option>
                            <option value="amex">American Express</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nombre del titular</label>
                        <input type="text" id="cardName" placeholder="Como aparece en la tarjeta">
                    </div>
                    <div class="form-group">
                        <label>Fecha de expiración</label>
                        <input type="text" id="expiry" placeholder="MM/AA">
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="password" id="cvv" placeholder="***" maxlength="4">
                    </div>
                    <div class="form-group">
                        <label>Dirección de envío</label>
                        <textarea id="direccion" rows="2" placeholder="Ingresa tu dirección completa para el envío"></textarea>
                    </div>
                    <div class="info-box">
                        <p><strong>Monto a pagar:</strong> <strong style="color:#0A2B4E">$${getCartTotal().toFixed(2)}</strong></p>
                        <p><strong>Cuotas:</strong> Hasta 12 cuotas sin interés</p>
                    </div>
                    <button class="pay-btn" onclick="confirmPayment('tarjeta')">Pagar</button>
                </div>
            `;
            break;
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    document.body.style.overflow = '';
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    showNotification('✅ Texto copiado al portapapeles', false);
}

function showNotification(message, isError = false) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${isError ? '#dc3545' : '#0A2B4E'};
        color: white;
        padding: 12px 24px;
        border-radius: 40px;
        z-index: 1200;
        animation: fadeOut 2s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

function confirmPayment(method) {
    // Obtener dirección de envío
    const direccion = document.getElementById('direccion')?.value || 'No especificada';
    
    if (!direccion || direccion === 'No especificada') {
        showNotification('⚠️ Por favor, ingresa tu dirección de envío', true);
        return;
    }
    
    // Crear objeto de compra
    const compra = {
        usuario: currentUser,
        fecha: new Date().toISOString(),
        productos: cart,
        subtotal: getCartSubtotal(),
        envio: {
            metodo: selectedShipping,
            nombre: getShippingName(selectedShipping),
            costo: shippingCost
        },
        total: getCartTotal(),
        direccion: direccion,
        metodoPago: method,
        estado: 'pendiente'
    };
    
    // Guardar en historial de compras
    let historial = JSON.parse(localStorage.getItem('historial_compras')) || [];
    historial.push(compra);
    localStorage.setItem('historial_compras', JSON.stringify(historial));
    
    // Mostrar detalles del envío en modal
    const shippingDetails = document.getElementById('shippingDetails');
    let shippingMethodText = '';
    let shippingTimeText = '';
    
    switch(selectedShipping) {
        case 'delivery':
            shippingMethodText = 'Delivery Nacional';
            shippingTimeText = '1-3 días hábiles';
            break;
        case 'mrw':
            shippingMethodText = 'MRW Venezuela';
            shippingTimeText = '2-5 días hábiles con número de guía';
            break;
        case 'internacional':
            shippingMethodText = 'Envío Internacional';
            shippingTimeText = '7-15 días hábiles con seguimiento';
            break;
    }
    
    if (shippingDetails) {
        shippingDetails.innerHTML = `
            <p><strong>📦 Método de envío:</strong> ${shippingMethodText}</p>
            <p><strong>⏱️ Tiempo estimado:</strong> ${shippingTimeText}</p>
            <p><strong>📍 Dirección:</strong> ${direccion}</p>
            <p><strong>💰 Costo de envío:</strong> $${shippingCost.toFixed(2)}</p>
        `;
        shippingDetails.style.display = 'block';
    }
    
    // Cerrar modales
    closePaymentModal();
    closeOrderSidebar();
    
    // Mostrar modal de confirmación
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'flex';
    
    // Limpiar carrito
    localStorage.removeItem('cart_meli');
    cart = [];
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    window.location.href = 'dashboard.html';
}

// ===== EVENTOS =====
document.addEventListener('DOMContentLoaded', () => {
    // Eventos de métodos de envío
    document.querySelectorAll('.shipping-card').forEach(card => {
        card.addEventListener('click', () => {
            const method = card.dataset.shipping;
            selectShipping(method);
        });
    });
    
    // Eventos de métodos de pago
    document.querySelectorAll('.payment-card').forEach(card => {
        card.addEventListener('click', () => {
            const method = card.dataset.method;
            showPaymentDetails(method);
        });
    });
    
    // Eventos del sidebar
    document.getElementById('viewOrderBtn').addEventListener('click', toggleOrderSidebar);
    document.getElementById('closeOrderBtn').addEventListener('click', closeOrderSidebar);
    document.getElementById('overlay').addEventListener('click', closeOrderSidebar);
    document.getElementById('closePaymentModal').addEventListener('click', closePaymentModal);
    document.getElementById('continueShoppingBtn').addEventListener('click', closeConfirmModal);
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('paymentModal')) {
            closePaymentModal();
        }
        if (e.target === document.getElementById('confirmModal')) {
            closeConfirmModal();
        }
    });
    
    // Inicializar
    renderOrderSummary();
    updateShippingDetails();
});

console.log('💰 Página de pagos cargada');
console.log('📦 Subtotal: $' + getCartSubtotal().toFixed(2));