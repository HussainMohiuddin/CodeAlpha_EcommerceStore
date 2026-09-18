function renderCartPage() {
  const container = document.getElementById('cart-content');
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `<p class="muted">Your cart is empty. <a href="index.html">Continue shopping</a>.</p>`;
    return;
  }

  const rows = cart
    .map(
      (item) => `
    <tr>
      <td>
        <div class="cart-row-info">
          <img src="${item.image || 'https://placehold.co/100x100?text=No+Image'}" alt="${escapeHtml(item.name)}" />
          <span>${escapeHtml(item.name)}</span>
        </div>
      </td>
      <td>$${item.price.toFixed(2)}</td>
      <td><input type="number" class="qty-input" min="1" value="${item.quantity}" data-id="${item.productId}" /></td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
      <td><button class="link-btn" data-remove="${item.productId}">Remove</button></td>
    </tr>
  `
    )
    .join('');

  container.innerHTML = `
    <table>
      <thead>
        <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="summary-box">
      <div class="summary-row summary-total">
        <span>Total</span>
        <span>$${cartTotal().toFixed(2)}</span>
      </div>
      <button id="checkout-btn" class="btn" style="width:100%; margin-top:14px;">Proceed to Checkout</button>
    </div>
  `;

  container.querySelectorAll('input[data-id]').forEach((input) => {
    input.addEventListener('change', () => {
      const qty = Math.max(0, parseInt(input.value, 10) || 0);
      updateCartQuantity(input.dataset.id, qty);
      renderNav();
      renderCartPage();
    });
  });

  container.querySelectorAll('button[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.remove);
      renderNav();
      renderCartPage();
    });
  });

  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (!getUser()) {
      window.location.href = 'login.html?redirect=checkout.html';
    } else {
      window.location.href = 'checkout.html';
    }
  });
}

renderCartPage();
