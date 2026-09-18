function renderCheckout() {
  const container = document.getElementById('checkout-content');

  if (!getUser()) {
    window.location.href = 'login.html?redirect=checkout.html';
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `<p class="muted">Your cart is empty. <a href="index.html">Continue shopping</a>.</p>`;
    return;
  }

  const rows = cart
    .map(
      (item) => `
    <div class="summary-row">
      <span>${escapeHtml(item.name)} &times; ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `
    )
    .join('');

  container.innerHTML = `
    <div class="product-detail">
      <div>
        <h2>Shipping details</h2>
        <form id="checkout-form" class="form" style="max-width:100%;">
          <label for="fullName">Full name</label>
          <input type="text" id="fullName" required />

          <label for="address">Address</label>
          <input type="text" id="address" required />

          <div class="form-row">
            <div>
              <label for="city">City</label>
              <input type="text" id="city" required />
            </div>
            <div>
              <label for="postalCode">Postal code</label>
              <input type="text" id="postalCode" required />
            </div>
          </div>

          <label for="country">Country</label>
          <input type="text" id="country" required />

          <button type="submit" class="btn" style="margin-top:20px; width:100%;">Place Order</button>
          <div id="form-message"></div>
        </form>
      </div>
      <div>
        <h2>Order summary</h2>
        <div class="summary-box" style="max-width:100%;">
          ${rows}
          <div class="summary-row summary-total">
            <span>Total</span>
            <span>$${cartTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageEl = document.getElementById('form-message');
    messageEl.innerHTML = '';

    const shippingAddress = {
      fullName: document.getElementById('fullName').value.trim(),
      address: document.getElementById('address').value.trim(),
      city: document.getElementById('city').value.trim(),
      postalCode: document.getElementById('postalCode').value.trim(),
      country: document.getElementById('country').value.trim(),
    };

    const items = getCart().map((item) => ({ productId: item.productId, quantity: item.quantity }));

    try {
      const { order } = await apiRequest('/orders', {
        method: 'POST',
        auth: true,
        body: { items, shippingAddress },
      });
      clearCart();
      window.location.href = `orders.html?placed=${order._id}`;
    } catch (err) {
      messageEl.innerHTML = `<p class="error-box">${escapeHtml(err.message)}</p>`;
    }
  });
}

renderCheckout();
