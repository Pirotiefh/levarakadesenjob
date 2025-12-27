// ===============================
// CART SYSTEM
// ===============================

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function toggleCart() {
    document.getElementById("cart-panel").classList.toggle("open");
}

function updateCartDisplay() {
    const itemsContainer = document.getElementById("cart-items");
    const countEl = document.getElementById("cart-count");
    const totalEl = document.getElementById("cart-total");

    itemsContainer.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        itemsContainer.innerHTML += `
            <div class="cart-item">
                <strong>${item.name}</strong><br>
                $${item.price} × 
                <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                ${item.quantity}
                <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                <br>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });

    countEl.textContent = count;
    totalEl.textContent = total.toFixed(2);

    saveCart();
}

// Make these functions global so buttons can call them
window.changeQuantity = function(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartDisplay();
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// ===============================
// ADD-TO-CART AND CHECKOUT
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    // Add-to-cart buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);

            const existing = cart.find(item => item.name === name);
            if (existing) existing.quantity++;
            else cart.push({ name, price, quantity: 1 });

            updateCartDisplay();
        });
    });
    document.addEventListener("click", (event) => {
        const cartPanel = document.getElementById("cart-panel");
        const cartIcon = document.querySelector(".cart-icon");
    
        // If the cart panel is open and the click is outside both the cart panel and the cart icon
        if (cartPanel.classList.contains("open") &&
            !cartPanel.contains(event.target) &&
            !cartIcon.contains(event.target)) {
            cartPanel.classList.remove("open"); // Close the cart
        }
    });
    
    // Checkout logic
    const checkoutBtn = document.getElementById("checkout-btn");
    const checkoutForm = document.getElementById("checkout-form");

    checkoutBtn.addEventListener("click", () => {
        checkoutForm.style.display = "flex";
        checkoutBtn.style.display = "none";
    });

    checkoutForm.addEventListener("submit", (e) => {
        // Fill hidden fields at submit time
        document.getElementById("order-total").value =
            document.getElementById("cart-total").textContent;
    
        let itemsText = cart
            .map(item => `${item.name} (x${item.quantity}) - $${item.price * item.quantity}`)
            .join(", ");
    
        document.getElementById("order-items").value = itemsText;
    
        // Do NOT reset form here! Let Formspree submit the actual values
        // Only clear cart after a short delay to avoid clearing before submission
        setTimeout(() => {
            cart = [];
            updateCartDisplay();
            checkoutForm.reset();
            checkoutForm.style.display = "none";
            checkoutBtn.style.display = "block";
        }, 500); // 500ms delay ensures Formspree sees the data
    });
    

});

// ===============================
// INITIALIZE
// ===============================
updateCartDisplay();
