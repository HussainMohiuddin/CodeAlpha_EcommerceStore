function renderNav() {
  const mount = document.getElementById('nav-placeholder');
  if (!mount) return;

  const user = getUser();
  const count = cartCount();

  mount.innerHTML = `
    <nav class="navbar">
      <a class="brand" href="index.html">CodeAlpha Store</a>
      <div class="nav-links">
        <a href="index.html">Home</a>
        <a href="cart.html">Cart${count > 0 ? ` (${count})` : ''}</a>
        ${
          user
            ? `<a href="orders.html">My Orders</a>
               <span class="nav-user">Hi, ${escapeHtml(user.name)}</span>
               <button id="logout-btn" class="link-btn">Logout</button>`
            : `<a href="login.html">Login</a>
               <a href="register.html">Register</a>`
        }
      </div>
    </nav>
  `;

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      window.location.href = 'index.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', renderNav);
