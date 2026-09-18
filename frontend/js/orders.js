async function loadOrders() {
  const container = document.getElementById('orders-content');

  if (!getUser()) {
    window.location.href = 'login.html?redirect=orders.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const placedId = params.get('placed');

  container.innerHTML = '<p class="muted">Loading your orders...</p>';

  try {
    const { orders } = await apiRequest('/orders/mine', { auth: true });

    if (orders.length === 0) {
      container.innerHTML = `<p class="muted">You haven't placed any orders yet. <a href="index.html">Start shopping</a>.</p>`;
      return;
    }

    const banner = placedId
      ? `<div class="success-box">Order placed successfully! Order ID: ${escapeHtml(placedId)}</div>`
      : '';

    container.innerHTML =
      banner +
      orders
        .map(
          (order) => `
      <div class="order-card">
        <div class="summary-row">
          <strong>Order #${order._id.slice(-8).toUpperCase()}</strong>
          <span class="badge badge-${order.status}">${order.status}</span>
        </div>
        <p class="muted">Placed on ${new Date(order.createdAt).toLocaleString()}</p>
        <table>
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>${escapeHtml(item.name)}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <p><strong>Shipping to:</strong> ${escapeHtml(order.shippingAddress.fullName)}, ${escapeHtml(order.shippingAddress.address)}, ${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(order.shippingAddress.postalCode)}, ${escapeHtml(order.shippingAddress.country)}</p>
        <p class="summary-total">Total: $${order.totalAmount.toFixed(2)}</p>
      </div>
    `
        )
        .join('');
  } catch (err) {
    container.innerHTML = `<p class="error-box">Failed to load orders: ${escapeHtml(err.message)}</p>`;
  }
}

loadOrders();
