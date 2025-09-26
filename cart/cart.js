// ================================
// CART INITIALIZATION
// ================================

// Load cart from localStorage (or start empty if none exists)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Select cart-related elements
const cartIcon = document.getElementById('cart-icon');
const cartContainer = document.getElementById('cart-container');

// Create a header inside the cart (title + buttons)
const cartHeader = document.createElement('div');
cartHeader.id = 'cart-header';
cartHeader.style.display = 'flex';
cartHeader.style.justifyContent = 'space-between';
cartHeader.style.alignItems = 'center';
cartHeader.style.padding = '5px 10px';
cartHeader.style.backgroundColor = '#f0f0f0';
cartHeader.style.borderBottom = '1px solid #ccc';
cartContainer.prepend(cartHeader);

// Title text inside the cart header
const cartTitle = document.createElement('span');
cartTitle.textContent = 'Your Cart';
cartHeader.appendChild(cartTitle);

// ================================
// MINIMIZE & CLOSE BUTTONS
// ================================

// Minimize button (toggle collapsed cart view)
const minimizeBtn = document.createElement('button');
minimizeBtn.textContent = '—'; // minus symbol
minimizeBtn.style.marginRight = '5px';
cartHeader.appendChild(minimizeBtn);

// Close button (completely hide cart)
const closeBtn = document.createElement('button');
closeBtn.textContent = '×'; // close symbol
cartHeader.appendChild(closeBtn);

// ================================
// CART ITEM & TOTAL ELEMENTS
// ================================
const cartItemsEl = document.getElementById('cart-items');
const totalItemsEl = document.getElementById('total-items');
const totalPriceEl = document.getElementById('total-price');
const clearCartBtn = document.getElementById('clear-cart-btn');

// ================================
// QUANTITY MODAL (for choosing amount before adding)
// ================================
const qtyModal = document.getElementById('qty-modal');
const qtyNumberEl = document.getElementById('qty-number');
const qtyProductNameEl = document.getElementById('qty-product-name');
let selectedProduct = null; // Stores currently selected product
let selectedQty = 1;        // Default quantity

// ================================
// RENDER CART FUNCTION
// Updates cart display (items, total, localStorage)
// ================================
function renderCart() {
  cartItemsEl.innerHTML = ''; // Clear existing items
  let totalItems = 0;
  let totalPrice = 0;

  // Loop through cart items and display them
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} x ${item.qty} - R${item.price * item.qty}`;
    cartItemsEl.appendChild(li);
    totalItems += item.qty;
    totalPrice += item.price * item.qty;
  });

  // Update totals in UI
  totalItemsEl.textContent = totalItems;
  totalPriceEl.textContent = totalPrice;

  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Run first render on page load
renderCart();

// ================================
// CART ICON TOGGLE
// Open cart when clicking on the cart icon
// ================================
cartIcon.addEventListener('click', () => {
  cartContainer.style.display = 'block';
  cartContainer.classList.remove('minimized');
});

// Minimize cart (collapse view, stays visible)
minimizeBtn.addEventListener('click', () => {
  cartContainer.classList.toggle('minimized');
});

// Close cart (hide completely)
closeBtn.addEventListener('click', () => {
  cartContainer.style.display = 'none';
});

// ================================
// ADD TO CART BUTTONS
// Opens quantity modal for the clicked product
// ================================
document.querySelectorAll('.add-cart-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    selectedProduct = {
      name: card.dataset.name,
      price: parseFloat(card.dataset.price)
    };
    selectedQty = 1; // Reset to default qty
    qtyNumberEl.textContent = selectedQty;
    qtyProductNameEl.textContent = selectedProduct.name;
    qtyModal.style.display = 'block'; // Show modal
  });
});

// ================================
// QUANTITY MODAL CONTROLS
// Increment / Decrement product quantity
// ================================
document.getElementById('plus').addEventListener('click', () => {
  selectedQty++;
  qtyNumberEl.textContent = selectedQty;
});

document.getElementById('minus').addEventListener('click', () => {
  if (selectedQty > 1) selectedQty--; // Prevent going below 1
  qtyNumberEl.textContent = selectedQty;
});

// Confirm quantity and add product to cart
document.getElementById('qty-done').addEventListener('click', () => {
  const existing = cart.find(item => item.name === selectedProduct.name);
  if (existing) existing.qty += selectedQty; // If already in cart, increase qty
  else cart.push({ ...selectedProduct, qty: selectedQty }); // Add new product

  renderCart();
  qtyModal.style.display = 'none';        // Close modal
  cartContainer.style.display = 'block';  // Open cart
  cartContainer.classList.remove('minimized'); // Ensure fully expanded
});

// Cancel button (close modal without adding)
document.getElementById('qty-cancel').addEventListener('click', () => {
  qtyModal.style.display = 'none';
});

// ================================
// CLEAR CART BUTTON
// Empties cart and hides it
// ================================
clearCartBtn.addEventListener('click', () => {
  cart = [];               // Reset cart
  renderCart();            // Update UI
  cartContainer.style.display = 'none'; // Hide cart
});

// ================================
// CHECKOUT BUTTON
// Handles checkout process
// ================================
const checkoutBtn = document.getElementById('checkout-btn');
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
  } else {
    alert('Thank you for your purchase!');
    cart = [];               // Clear cart after purchase
    renderCart();            // Update UI
    cartContainer.style.display = 'none'; // Hide cart
  }
});
