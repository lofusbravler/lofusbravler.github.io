// Проверяем, открыто ли в Telegram WebView
const isTelegram = window.Telegram && window.Telegram.WebApp;

if (isTelegram) {
    // Если в Telegram - инициализируем WebApp
    const tg = window.Telegram.WebApp;
    tg.expand();
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

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartInfo();
    
    // Обработчик кнопки оформления заказа
    document.getElementById('checkout-btn').addEventListener('click', checkout);
});

// Рендер товаров
function renderProducts() {
    const productsContainer = document.querySelector('.products');
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
    document.getElementById('cart-total').textContent = totalSum + ' ₽';
    document.getElementById('checkout-btn').disabled = totalCount === 0;
    
    document.querySelectorAll('.quantity').forEach(el => {
        const productId = parseInt(el.dataset.id);
        const cartItem = cart.find(item => item.product.id === productId);
        el.textContent = cartItem ? cartItem.quantity : '0';
    });
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) return;
    
    const orderData = {
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
        // Если в Telegram - отправляем данные в бота
        window.Telegram.WebApp.sendData(JSON.stringify(orderData));
        window.Telegram.WebApp.close();
    } else {
        // Если не в Telegram - просто показываем информацию
        alert(`Заказ оформлен!\nТоваров: ${orderData.products.length}\nСумма: ${orderData.total} ₽\n\nДанные заказа:\n${JSON.stringify(orderData, null, 2)}`);
        
        // Можно добавить сохранение в localStorage
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        
        // Очищаем корзину
        cart = [];
        updateCartInfo();
    }
}
