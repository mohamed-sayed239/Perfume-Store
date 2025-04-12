let iconSearsh = document.querySelector('.fa-magnifying-glass');
let iconCart = document.querySelector('.fa-cart-shopping');
let bar = document.querySelector('.fa-bars');
let cart = document.querySelector('.container-cart');
let searsh = document.querySelector('.searsh-form');
let mainhead = document.querySelector('.main-head');
let  remove= document.querySelector(".main-head .remove-container");

remove.onclick = ()=>{
    mainhead.classList.remove('open')
}
bar.onclick = ()=>{
    mainhead.classList.toggle('open')
    cart.classList.remove('open')
    searsh.classList.remove('open')
}
iconSearsh.onclick = ()=>{
    searsh.classList.toggle('open')
    cart.classList.remove('open')
    mainhead.classList.remove('open')
}
iconCart.onclick = ()=>{
    cart.classList.toggle('open')
    searsh.classList.remove('open')
    mainhead.classList.remove('open')
};


function initializeSearch() {
    document.getElementById("search").addEventListener("keyup", function () {
        let input = this.value.toLowerCase();
        let items = document.querySelectorAll(".img-man, .img-women");

        items.forEach(item => {
            let title = item.querySelector("h2").textContent.toLowerCase();
            if (title.includes(input)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    });
}

initializeSearch();  // تفعيل البحث

document.addEventListener('DOMContentLoaded', function() {
    // Cart items array to store products
    let cartItems = [];
    let appliedPromoCode = null;
    
    // Shipping prices per governorate
    const shippingPrices = {
        'القاهرة': 75,
        'الإسكندرية': 75,
        'الدلتا': 95,
        'مدن القناة': 100,
        'جنوب وشمال الصعيد': 60,
        'شمال الصعيد': 125,
        'جنوب الصعيد': 135,
        'المحافظات الحدودية': 195
    };
    
    // Valid promo codes with 40 EGP discount per item
    const promoCodes = {
        'Ali20': true,
        'abdo20': true,
        'moro20': true
    };
    
    // Initialize quantity buttons
    function initQuantityButtons() {
        document.querySelectorAll('.count button').forEach(button => {
            button.addEventListener('click', function() {
                const span = this.parentElement.querySelector('span');
                let quantity = parseInt(span.textContent);
                
                if (this.querySelector('.fa-plus')) {
                    quantity++;
                } else if (this.querySelector('.fa-minus') && quantity > 0) {
                    quantity--;
                }
                
                span.textContent = quantity;
            });
        });
    }
    
    // Initialize add to cart buttons
    function initAddToCartButtons() {
        document.querySelectorAll('.add-to-card').forEach(button => {
            button.addEventListener('click', function() {
                const productContainer = this.closest('.img-man, .img-women');
                const productName = productContainer.querySelector('h2').textContent.trim();
                const productPrice = parseFloat(productContainer.querySelector('h3').textContent.match(/(\d+)/)[0]);
                const productImage = productContainer.querySelector('img').src;
                const quantity = parseInt(productContainer.querySelector('.count span').textContent);
                
                if (quantity > 0) {
                    addToCart(productName, productPrice, productImage, quantity);
                    updateCartUI();
                }
            });
        });
    }
    
    // Add product to cart
    function addToCart(name, price, image, quantity) {
        const existingItem = cartItems.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({
                name: name,
                price: price,
                originalPrice: price, // Store original price for promo code calculations
                image: image,
                quantity: quantity
            });
        }
    }
    
    // Apply promo code discount
    function applyPromoCode(code) {
        if (promoCodes[code]) {
            appliedPromoCode = code;
            cartItems.forEach(item => {
                item.price = item.originalPrice - 40; // Apply 40 EGP discount per item
            });
            return true;
        }
        return false;
    }
    
    // Update cart UI
    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalContainer = document.querySelector('.cart-total');
        const btnCartContainer = document.querySelector('.btn-cart');
        
        // Clear previous content
        cartItemsContainer.innerHTML = '';
        
        // Add scroll if more than 3 items
        if (cartItems.length > 3) {
            cartItemsContainer.style.overflowY = 'auto';
            cartItemsContainer.style.maxHeight = '50vh';
        } else {
            cartItemsContainer.style.overflowY = 'visible';
            cartItemsContainer.style.maxHeight = 'none';
        }
        
        // Add cart items
        let total = 0;
        let discount = 0;
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const originalItemTotal = item.originalPrice * item.quantity;
            total += itemTotal;
            discount += (originalItemTotal - itemTotal);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.price} EGP × ${item.quantity}</p>
                    ${appliedPromoCode ? `<p class="original-price">${item.originalPrice} EGP</p>` : ''}
                    <p class="item-total">${itemTotal} EGP</p>
                </div>
                <button class="remove-item">×</button>
            `;
            
            // Add remove item functionality
            itemElement.querySelector('.remove-item').addEventListener('click', () => {
                cartItems = cartItems.filter(cartItem => cartItem.name !== item.name);
                updateCartUI();
            });
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Add shipping selection and total
        cartTotalContainer.innerHTML = `
            <div class="promo-code-section">
                <label for="promo-code">كود الخصم:</label>
                <input type="text" id="promo-code" placeholder="أدخل كود الخصم">
                <button id="apply-promo">تطبيق</button>
            </div>
            <div class="shipping-selection">
                <label for="governorate">اختر المحافظة:</label>
                <select id="governorate">
                    ${Object.keys(shippingPrices).map(gov => 
                        `<option value="${gov}">${gov} - ${shippingPrices[gov]} EGP</option>`
                    ).join('')}
                </select>
            </div>
            <div class="total-price">
                ${appliedPromoCode ? `<p>الخصم (كود: ${appliedPromoCode}): <span>${discount} EGP</span></p>` : ''}
                <p>الإجمالي: <span>${total} EGP</span></p>
                <p>الشحن: <span id="shipping-price">0 EGP</span></p>
                <p class="grand-total">المجموع الكلي: <span>${total} EGP</span></p>
            </div>
        `;
        
        // Add confirm order button
        btnCartContainer.innerHTML = `
            <button class="confirm-order">تأكيد الطلب</button>
        `;
        
        // Initialize promo code button
        document.getElementById('apply-promo')?.addEventListener('click', function() {
            const promoCode = document.getElementById('promo-code').value.trim();
            if (applyPromoCode(promoCode)) {
                updateCartUI();
                alert('تم تطبيق كود الخصم بنجاح! خصم 40 جنيهاً على كل منتج');
            } else {
                alert('كود الخصم غير صحيح! الأكواد الصالحة: Ali20, abdo20, moro20');
            }
        });
        
        // Update shipping price when governorate changes
        document.getElementById('governorate').addEventListener('change', function() {
            const shippingPrice = shippingPrices[this.value];
            document.getElementById('shipping-price').textContent = `${shippingPrice} EGP`;
            document.querySelector('.grand-total span').textContent = `${total + shippingPrice} EGP`;
        });
        
        // Initialize confirm order button
        document.querySelector('.confirm-order')?.addEventListener('click', confirmOrder);
    }
    
    // Confirm order and send WhatsApp message
    function confirmOrder() {
        const governorate = document.getElementById('governorate').value;
        const shippingPrice = shippingPrices[governorate];
        const total = calculateTotal();
        const grandTotal = total + shippingPrice;
        
        // Prepare order details message
        let message = `مرحباً، أريد طلب المنتجات التالية:\n\n`;
        
        cartItems.forEach(item => {
            const originalPrice = item.originalPrice * item.quantity;
            const discountedPrice = item.price * item.quantity;
            
            message += `- ${item.name} (${item.quantity} × ${item.price} EGP) = ${discountedPrice} EGP`;
            
            if (appliedPromoCode) {
                message += ` (بعد الخصم من ${originalPrice} EGP)`;
            }
            
            message += `\n`;
        });
        
        message += `\nإجمالي المنتجات: ${total} EGP\n`;
        
        if (appliedPromoCode) {
            const discount = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
            message += `الخصم (كود: ${appliedPromoCode}): ${discount} EGP\n`;
        }
        
        message += `سعر الشحن (${governorate}): ${shippingPrice} EGP\n`;
        message += `المجموع الكلي: ${grandTotal} EGP\n\n`;
        message += `الرجاء تأكيد الطلب`;
        
        // Encode message for WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp with order details
        window.open(`https://wa.me/201096963117?text=${encodedMessage}`, '_blank');
    }
    
    // Calculate total without shipping
    function calculateTotal() {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    // Initialize all functionality
    function init() {
        initQuantityButtons();
        initAddToCartButtons();
    }
    
    // Start the application
    init();
});