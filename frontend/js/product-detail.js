async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const statusEl = document.getElementById('status-message');
  const container = document.getElementById('product-detail');

  if (!id) {
    statusEl.textContent = 'No product specified.';
    return;
  }

  statusEl.textContent = 'Loading product...';

  try {
    const { product } = await apiRequest(`/products/${id}`);
    statusEl.textContent = '';

    container.innerHTML = `
      <div>
        <img src="${product.image || 'https://placehold.co/500x500?text=No+Image'}" alt="${escapeHtml(product.name)}" />
      </div>
      <div>
        <div class="card-category">${escapeHtml(product.category)}</div>
        <h1>${escapeHtml(product.name)}</h1>
        <p>${escapeHtml(product.description)}</p>
        <p class="card-price">$${product.price.toFixed(2)}</p>
        <p class="muted">${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <div class="form-row" style="align-items:center; max-width:220px;">
          <label for="qty" style="margin:0;">Qty</label>
          <input type="number" id="qty" class="qty-input" value="1" min="1" max="${Math.max(product.stock, 1)}" />
        </div>
        <button id="add-btn" class="btn" style="margin-top:16px;" ${product.stock <= 0 ? 'disabled' : ''}>
          ${product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
        </button>
        <div id="add-msg"></div>
      </div>
    `;

    const addBtn = document.getElementById('add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const qty = Math.max(1, parseInt(document.getElementById('qty').value, 10) || 1);
        addToCart(product, qty);
        renderNav();
        document.getElementById('add-msg').innerHTML = '<p class="success-box">Added to cart!</p>';
      });
    }
  } catch (err) {
    statusEl.textContent = `Failed to load product: ${err.message}`;
  }
}

loadProduct();
