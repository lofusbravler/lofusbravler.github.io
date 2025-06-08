// Проверяем, открыто ли в Telegram WebView
const isTelegram = window.Telegram && window.Telegram.WebApp;

if (isTelegram) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.enableClosingConfirmation();
}

// Данные товаров
const products = [
    {
        id: 1,
        name: "Футболка",
        price: 990,
        image: "https://via.placeholder.com/150?text=T-Shirt"
    },
    {
        id: 2,
        name: "Джинсы",
        price: 2490,
        image: "https://via.placeholder.com/150?text=Jeans"
    },
    {
        id: 3,
        name: "Кроссовки",
        price: 3990,
        image: "https://via.placeholder.com/150?text=Sneakers"
    },
    {
        id: 4,
        name: "Часы",
        price: 5990,
        image: "https://via.placeholder.com/150?text=Watch"
    }
];

// Корзина
let cart = [];

// DOM элементы
const screens = {
    products: document.getElementById('products-screen'),
    cart: document.getElementById('cart-screen'),
    checkout: document.getElementById('checkout-screen'),
    confirmation: document.getElementById('confirmation-screen')
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartInfo();
    
    // Обработчики навигации
    document.getElementById('cart-btn').addEventListener('click', showCart);
    document.getElementById('back-to-products').addEventListener('click', showProducts);
    document.getElementById('proceed-to-checkout').addEventListener('click', showCheckout);
    document.getElementById('back-to-cart').addEventListener('click', showCart);
    document.getElementById('close-app').addEventListener('click', closeApp);
    
    // Обработчик формы
    document.getElementById('order-form').addEventListener('submit', processOrder);
});

// Рендер товаров
function renderProducts() {
    const productsContainer = document.getElementById('products-list');
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${product.price} ₽</div>
            <div class="product-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${product.id}">-</button>
                    <span class="quantity" data-id="${product.id}">0</span>
                    <button class="quantity-btn plus" data-id="${product.id}">+</button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productElement);
    });
    
    // Обработчики для кнопок +/-
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
    });
}

// Рендер корзины
function renderCart() {
    const cartContainer = document.getElementById('cart-items-list');
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Корзина пуста</p>';
        document.getElementById('proceed-to-checkout').disabled = true;
        return;
    }
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h3 class="cart-item-title">${item.product.name}</h3>
                <div class="cart-item-price">${item.product.price} ₽ × ${item.quantity} = ${item.product.price * item.quantity} ₽</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.product.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.product.id}">+</button>
            </div>
        `;
        
        cartContainer.appendChild(cartItemElement);
    });
    
    // Обновляем кнопки +/- в корзине
    document.querySelectorAll('.cart-item .plus').forEach(btn => {
        btn.addEventListener('click', () => {
            addToCart(parseInt(btn.dataset.id));
            renderCart();
        });
    });
    
    document.querySelectorAll('.cart-item .minus').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(parseInt(btn.dataset.id));
            renderCart();
        });
    });
    
    // Обновляем общую сумму в корзине
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    document.getElementById('cart-total-cart').textContent = `${total} ₽`;
    document.getElementById('proceed-to-checkout').disabled = false;
}

// Добавление товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const cartItem = cart.find(item => item.product.id === productId);
    
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            product: product,
            quantity: 1
        });
    }
    
    updateCartInfo();
}

// Удаление товара из корзины
function removeFromCart(productId) {
    const cartItemIndex = cart.findIndex(item => item.product.id === productId);
    
    if (cartItemIndex !== -1) {
        if (cart[cartItemIndex].quantity > 1) {
            cart[cartItemIndex].quantity -= 1;
        } else {
            cart.splice(cartItemIndex, 1);
        }
    }
    
    updateCartInfo();
}

// Обновление информации о корзине
function updateCartInfo() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalSum = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    document.getElementById('cart-count').textContent = totalCount;
    document.getElementById('cart-total').textContent = `${totalSum} ₽`;
    
    document.querySelectorAll('.quantity').forEach(el => {
        const productId = parseInt(el.dataset.id);
        const cartItem = cart.find(item => item.product.id === productId);
        el.textContent = cartItem ? cartItem.quantity : '0';
    });
}

// Навигация по экранам
function showScreen(screen) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

function showProducts() {
    showScreen(screens.products);
}

function showCart() {
    renderCart();
    showScreen(screens.cart);
}

function showCheckout() {
    showScreen(screens.checkout);
}

function showConfirmation(orderData) {
    const summaryElement = document.getElementById('order-summary');
    summaryElement.innerHTML = `
        <h3>Детали заказа:</h3>
        <p><strong>Имя:</strong> ${orderData.name}</p>
        <p><strong>Телефон:</strong> ${orderData.phone}</p>
        ${orderData.address ? `<p><strong>Адрес:</strong> ${orderData.address}</p>` : ''}
        ${orderData.comments ? `<p><strong>Комментарий:</strong> ${orderData.comments}</p>` : ''}
        <hr>
        <h3>Товары:</h3>
        <ul>
            ${orderData.products.map(item => `
                <li>${item.name} - ${item.quantity} × ${item.price} ₽ = ${item.quantity * item.price} ₽</li>
            `).join('')}
        </ul>
        <hr>
        <p><strong>Итого:</strong> ${orderData.total} ₽</p>
    `;
    showScreen(screens.confirmation);
}

// Обработка заказа
function processOrder(e) {
    e.preventDefault();
    
    const orderData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        comments: document.getElementById('comments').value,
        products: cart.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        })),
        total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        date: new Date().toISOString()
    };
    
    if (isTelegram) {
        // Отправляем данные в бота
        const tg = window.Telegram.WebApp;
        
        // Формируем сообщение для администратора
        const adminMessage = formatAdminMessage(orderData);
        
        // Отправляем данные
        tg.sendData(JSON.stringify({
            ...orderData,
            admin_message: adminMessage
        }));
        
        // Показываем подтверждение
        showConfirmation(orderData);
    } else {
        // В браузере просто показываем подтверждение
        showConfirmation(orderData);
        
        // Можно добавить отправку на email или сохранение в базу
        console.log('Order data:', orderData);
        
        // Очищаем корзину
        cart = [];
        updateCartInfo();
    }
}

// Форматирование сообщения для администратора
function formatAdminMessage(orderData) {
    return `
🛍 *Новый заказ* 🛍

👤 *Клиент:* ${orderData.name}
📞 *Телефон:* ${orderData.phone}
${orderData.address ? `🏠 *Адрес:* ${orderData.address}\n` : ''}
${orderData.comments ? `💬 *Комментарий:* ${orderData.comments}\n` : ''}

📦 *Товары:*
${orderData.products.map(item => `- ${item.name} (${item.price} ₽) × ${item.quantity} = ${item.price * item.quantity} ₽`).join('\n')}

💰 *Итого:* ${orderData.total} ₽
📅 ${new Date(orderData.date).toLocaleString()}
    `;
}

function closeApp() {
    if (isTelegram) {
        window.Telegram.WebApp.close();
    } else {
        showProducts();
        document.getElementById('order-form').reset();
    }
}
