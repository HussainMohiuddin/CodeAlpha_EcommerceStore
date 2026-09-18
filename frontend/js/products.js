let allProducts = [];

async function loadProducts() {
  const statusEl = document.getElementById('status-message');
  statusEl.textContent = 'Loading products...';

  try {
    const { products } = await apiRequest('/products');
    allProducts = products;
    populateCategories(products);
    renderProducts(products);
    statusEl.textContent = '';
  } catch (err) {
    statusEl.textContent = `Failed to load products: ${err.message}`;
  }
}

function populateCategories(products) {
  const select = document.getElementById('category-filter');
  const categories = [...new Set(products.map((p) => p.category))].sort();
  for (const cat of categories) {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  }
}

function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  if (products.length === 0) {
    grid.innerHTML = '<p class="muted">No products found.</p>';
    return;
  }

  grid.innerHTML = products
    .map(
      (p) => `
    <div class="card">
      <a href="product.html?id=${p._id}">
        <img src="${p.image || 'https://placehold.co/500x500?text=No+Image'}" alt="${escapeHtml(p.name)}" />
      </a>
      <div class="card-body">
        <div class="card-category">${escapeHtml(p.category)}</div>
        <a href="product.html?id=${p._id}" class="card-title">${escapeHtml(p.name)}</a>
        <div class="card-price">$${p.price.toFixed(2)}</div>
        <button class="btn" data-id="${p._id}" ${p.stock <= 0 ? 'disabled' : ''}>
          ${p.stock <= 0 ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </div>
  `
    )
    .join('');

  grid.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = allProducts.find((p) => p._id === btn.dataset.id);
      addToCart(product, 1);
      renderNav();
      btn.textContent = 'Added!';
      setTimeout(() => {
        btn.textContent = 'Add to cart';
      }, 800);
    });
  });
}

function applyFilters() {
  const search = document.getElementById('search-input').value.trim().toLowerCase();
  const category = document.getElementById('category-filter').value;

  const filtered = allProducts.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search);
    const matchesCategory = !category || p.category === category;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

document.getElementById('search-input').addEventListener('input', applyFilters);
document.getElementById('category-filter').addEventListener('change', applyFilters);

loadProducts();
