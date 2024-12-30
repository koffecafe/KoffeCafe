// Select the menu toggle button and sidebar elements
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');

// Add event listener to open the sidebar when the menu toggle is clicked
menuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
});

// Add event listener to close the sidebar when the close button is clicked
sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// Optional: Close the sidebar if the user clicks outside of it
document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        sidebar.classList.remove('active');
    }
});

document.getElementById('view-cart-btn').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'flex';
    loadCart();
});

document.getElementById('close-cart-modal').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
});

document.getElementById('close-checkout-modal').addEventListener('click', cancelCheckout);

document.getElementById('checkout-form').addEventListener('submit', (event) => {
    event.preventDefault();
    placeOrder();
});

function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to your cart!`);
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalSummary = document.getElementById('order-summary');

    cartItemsContainer.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        const table = document.createElement('table');
        const headerRow = `
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
            </thead>`;
        table.innerHTML = headerRow;
        const body = document.createElement('tbody');

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalItems += item.quantity;
            totalPrice += itemTotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </td>
                <td>&#8369;${item.price.toFixed(2)}</td>
                <td>&#8369;${itemTotal.toFixed(2)}</td>
                <td><button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button></td>
            `;
            body.appendChild(row);
        });

        table.appendChild(body);
        cartItemsContainer.appendChild(table);
    }

    totalSummary.innerHTML = `
        <h3>Order Summary</h3>
        <p>Total Items: ${totalItems}</p>
        <p>Total Price: &#8369;${totalPrice.toFixed(2)}</p>
    `;
}

// Hide all modals on page load
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('receipt-modal').style.display = 'none';
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'none';
});

function changeQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === id);

    if (index >= 0) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    loadCart();
}

function showCheckoutModal() {
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'flex';
    updateCheckoutSummary();
}

function cancelCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function updateCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = document.querySelector('input[name="payment-method"][value="walkin"]').checked ? 0 : 50;

    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    document.getElementById('delivery-fee').textContent = deliveryFee.toFixed(2);
}

document.querySelectorAll('input[name="payment-method"]').forEach(input => {
    input.addEventListener('change', updateCheckoutSummary);
});

// Create Receipt Modal
document.body.insertAdjacentHTML('beforeend', `
<div id="receipt-modal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="close-btn" id="close-receipt-modal">&times;</span>
        <h2>Order Receipt</h2>
        <div id="receipt-details"></div>
        <button id="close-receipt-button">Close</button>
    </div>
</div>
`);

// Style the modal
const style = document.createElement("style");
style.textContent = `
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content {
    background: #fcd7b7;
    padding: 20px;
    border-radius: 10px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.close-btn {
    font-size: 1.5rem;
    color: #333;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
}
button {
    padding: 10px 20px;
    background: #c9a17e;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
}
button:hover {
    background: #a9835b;
}
`;
document.head.appendChild(style);

// Show Receipt Modal
function showReceipt(recipientName, deliveryAddress, paymentMethod, finalTotal) {
    const receiptDetails = document.getElementById("receipt-details");
    receiptDetails.innerHTML = `
        <p><strong>Recipient:</strong> ${recipientName}</p>
        <p><strong>Address:</strong> ${deliveryAddress}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Total:</strong> ₱${finalTotal.toFixed(2)}</p>
    `;
    document.getElementById("receipt-modal").style.display = "flex";
}

// Close Receipt Modal
document.getElementById('close-receipt-modal').addEventListener('click', () => {
    document.getElementById('receipt-modal').style.display = 'none';
});
document.getElementById('close-receipt-button').addEventListener('click', () => {
    document.getElementById('receipt-modal').style.display = 'none';
});

// Place Order
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const recipientName = document.getElementById("recipientName").value;
    const deliveryAddress = document.getElementById("deliveryAddress").value;
    const paymentMethod = document.querySelector("input[name='payment-method']:checked").value;

    const totalPrice = parseFloat(document.getElementById("total-price").textContent);
    const deliveryFee = parseFloat(document.getElementById("delivery-fee").textContent);
    const finalTotal = totalPrice + deliveryFee;

    // Show receipt modal instead of alert
    showReceipt(recipientName, deliveryAddress, paymentMethod, finalTotal);

    clearCart();
    cancelCheckout();
}
