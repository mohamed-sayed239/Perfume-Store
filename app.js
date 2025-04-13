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
    // عناصر DOM
    const cartCounter = document.querySelector('.cart-counter');
    const cartNotification = document.querySelector('.cart-notification');
    
    // بيانات السلة
    let cartItems = [];
    let appliedPromoCode = null;
    
    // أسعار الشحن
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
    
    // أكواد الخصم
    const promoCodes = {
        'Ali20': true,
        'abdo20': true,
        'moro20': true
    };
    
    // تحديث عداد السلة
    function updateCartCounter() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // إظهار إشعار الإضافة
    function showNotification() {
        cartNotification.style.display = 'block';
        setTimeout(() => {
            cartNotification.style.display = 'none';
        }, 3000);
    }
    
    // إعداد أزرار الكمية
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
    
    // إعداد أزرار الإضافة للسلة
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
                    showNotification();
                    updateCartUI();
                }
            });
        });
    }
    
    // إضافة منتج للسلة
    function addToCart(name, price, image, quantity) {
        const existingItem = cartItems.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({
                name: name,
                price: price,
                originalPrice: price,
                image: image,
                quantity: quantity,
                withBox: true // افتراضيًا بعلبة
            });
        }
        updateCartCounter();
    }
    
    // تطبيق كود الخصم
    function applyPromoCode(code) {
        if (promoCodes[code]) {
            appliedPromoCode = code;
            cartItems.forEach(item => {
                item.price = Math.max(0, item.originalPrice - 40); // خصم 40 جنيهاً
            });
            return true;
        }
        return false;
    }
    
    // تحديث واجهة السلة
    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalContainer = document.querySelector('.cart-total');
        const btnCartContainer = document.querySelector('.btn-cart');
        
        cartItemsContainer.innerHTML = '';
        
        // إضافة التمرير إذا كان هناك أكثر من 3 عناصر
        if (cartItems.length > 3) {
            cartItemsContainer.style.overflowY = 'auto';
            cartItemsContainer.style.maxHeight = '50vh';
        } else {
            cartItemsContainer.style.overflowY = 'visible';
            cartItemsContainer.style.maxHeight = 'none';
        }
        
        // إضافة العناصر للسلة
        let total = 0;
        let discount = 0;
        
        cartItems.forEach((item, index) => {
            const finalPrice = item.withBox ? item.price : Math.max(0, item.price - 40);
            const itemTotal = finalPrice * item.quantity;
            const originalItemTotal = item.originalPrice * item.quantity;
            
            total += itemTotal;
            discount += (originalItemTotal - (item.withBox ? item.price : item.price - 40) * item.quantity);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${finalPrice} EGP × ${item.quantity}</p>
                    ${appliedPromoCode ? `<p class="original-price">${item.originalPrice} EGP</p>` : ''}
                    <div class="box-option">
                        <button class="${item.withBox ? 'active' : ''}" data-index="${index}" data-box="true">بعلبة</button>
                        <button class="${!item.withBox ? 'active' : ''}" data-index="${index}" data-box="false">بدون علبة (-40ج)</button>
                    </div>
                    <p class="item-total">${itemTotal} EGP</p>
                </div>
                <button class="remove-item">×</button>
            `;
            
            // إعداد أحداث الأزرار
            itemElement.querySelectorAll('.box-option button').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemIndex = parseInt(this.dataset.index);
                    cartItems[itemIndex].withBox = this.dataset.box === 'true';
                    updateCartUI();
                });
            });
            
            itemElement.querySelector('.remove-item').addEventListener('click', () => {
                cartItems = cartItems.filter((_, i) => i !== index);
                updateCartCounter();
                updateCartUI();
            });
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // تحديث الإجمالي وطرق الشحن
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
        
        btnCartContainer.innerHTML = `<button class="confirm-order">تأكيد الطلب</button>`;
        
        // أحداث DOM الجديدة
        document.getElementById('apply-promo')?.addEventListener('click', function() {
            const promoCode = document.getElementById('promo-code').value.trim();
            if (applyPromoCode(promoCode)) {
                updateCartUI();
                alert('تم تطبيق كود الخصم بنجاح! خصم 40 جنيهاً على كل منتج');
            } else {
                alert('كود الخصم غير صحيح! الأكواد الصالحة: Ali20, abdo20, moro20');
            }
        });
        
        document.getElementById('governorate')?.addEventListener('change', function() {
            const shippingPrice = shippingPrices[this.value];
            document.getElementById('shipping-price').textContent = `${shippingPrice} EGP`;
            document.querySelector('.grand-total span').textContent = `${total + shippingPrice} EGP`;
        });
        
        document.querySelector('.confirm-order')?.addEventListener('click', confirmOrder);
    }
    
    // تأكيد الطلب وإرسال واتساب
    function confirmOrder() {
        const governorate = document.getElementById('governorate').value;
        const shippingPrice = shippingPrices[governorate];
        const total = calculateTotal();
        const grandTotal = total + shippingPrice;
        
        let message = `مرحباً، أريد طلب المنتجات التالية:\n\n`;
        
        cartItems.forEach(item => {
            const finalPrice = item.withBox ? item.price : item.price - 40;
            message += `- ${item.name} (${item.quantity} × ${finalPrice} EGP) ${item.withBox ? 'بعلبة' : 'بدون علبة'} = ${finalPrice * item.quantity} EGP\n`;
        });
        
        message += `\nإجمالي المنتجات: ${total} EGP\n`;
        if (appliedPromoCode) message += `الخصم (كود: ${appliedPromoCode}): ${cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0)} EGP\n`;
        message += `سعر الشحن (${governorate}): ${shippingPrice} EGP\n`;
        message += `المجموع الكلي: ${grandTotal} EGP\n\n`;
        message += `الرجاء تأكيد الطلب`;
        
        window.open(`https://wa.me/201096963117?text=${encodeURIComponent(message)}`, '_blank');
    }
    
    // حساب الإجمالي
    function calculateTotal() {
        return cartItems.reduce((sum, item) => {
            const finalPrice = item.withBox ? item.price : Math.max(0, item.price - 40);
            return sum + (finalPrice * item.quantity);
        }, 0);
    }
    
    // التهيئة الأولية
    function init() {
        initQuantityButtons();
        initAddToCartButtons();
        updateCartCounter();
    }
    
    init();
});
