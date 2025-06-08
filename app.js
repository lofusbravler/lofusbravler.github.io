// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

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
    
    // Добавляем обработчики для кнопок +/-
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
    // Обновляем счетчик и сумму
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalSum = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    document.getElementById('cart-count').textContent = totalCount;
    document.getElementById('cart-total').textContent = totalSum + ' ₽';
    
    // Обновляем кнопку оформления
    document.getElementById('checkout-btn').disabled = totalCount === 0;
    
    // Обновляем количество у каждого товара
    document.querySelectorAll('.quantity').forEach(el => {
        const productId = parseInt(el.dataset.id);
        const cartItem = cart.find(item => item.product.id === productId);
        el.textContent = cartItem ? cartItem.quantity : '0';
    });
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) return;
    
    // Формируем данные для отправки
    const order = {
        products: cart,
        total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        user: tg.initDataUnsafe.user
    };
    
    // В реальном приложении здесь был бы запрос к вашему серверу
    console.log('Order data:', order);
    
    // Показываем подтверждение в Telegram
    tg.showAlert('Спасибо за заказ! Мы скоро с вами свяжемся.', () => {
        // Очищаем корзину после успешного заказа
        cart = [];
        updateCartInfo();
    });
}
