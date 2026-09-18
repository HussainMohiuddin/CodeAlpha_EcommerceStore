# CodeAlpha_EcommerceStore

**CodeAlpha Full Stack Development Internship — Task 1: Simple E-commerce Store**

A full-stack e-commerce store with product listings, product details, a shopping
cart, order processing, and user registration/login.

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT-based registration/login with bcrypt-hashed passwords

## Features

- Product catalog with search and category filtering
- Product details page
- Shopping cart (persisted in the browser, works without logging in)
- User registration and login (JWT auth)
- Checkout flow that creates an order, decrements stock, and validates prices/stock server-side
- Order history page for the logged-in user
- Centralized error handling and route protection middleware

## Project structure

```
CodeAlpha_EcommerceStore/
├── backend/           Express API server
│   ├── config/        MongoDB connection
│   ├── controllers/   Route handlers (auth, products, orders)
│   ├── middleware/    JWT auth guard, admin guard, error handling
│   ├── models/        Mongoose schemas: User, Product, Order
│   ├── routes/        /api/auth, /api/products, /api/orders
│   ├── seed/          Sample product seeder
│   └── server.js      App entry point (also serves the frontend)
├── frontend/          Static HTML/CSS/JS client
│   ├── css/style.css
│   ├── js/            api.js, cart.js, nav.js, and one file per page
│   └── *.html         index, product, cart, checkout, login, register, orders
└── docker-compose.yml MongoDB container for local development
```

## Getting started

### 1. Start MongoDB

If you don't already have MongoDB running locally, start one with Docker:

```bash
docker compose up -d
```

This runs MongoDB on `mongodb://127.0.0.1:27017`. Alternatively, point
`MONGO_URI` in `backend/.env` at a MongoDB Atlas connection string.

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` if needed (defaults work with the Docker Compose MongoDB above).

### 3. Install dependencies

```bash
npm install
```

### 4. Seed sample products (optional but recommended)

```bash
npm run seed
```

### 5. Run the server

```bash
npm run dev    # with auto-reload (nodemon)
# or
npm start
```

The app is served at **http://localhost:5000** — the Express server serves
both the REST API (`/api/...`) and the static frontend, so there's nothing
else to run.

## API overview

| Method | Endpoint              | Description                         | Auth      |
|--------|------------------------|--------------------------------------|-----------|
| POST   | `/api/auth/register`   | Create an account                    | Public    |
| POST   | `/api/auth/login`      | Log in, returns a JWT                | Public    |
| GET    | `/api/auth/profile`    | Current user's profile               | Required  |
| GET    | `/api/products`        | List products (`?search=&category=`) | Public    |
| GET    | `/api/products/:id`    | Product details                      | Public    |
| POST   | `/api/products`        | Create a product                     | Admin     |
| POST   | `/api/orders`          | Place an order from cart items       | Required  |
| GET    | `/api/orders/mine`     | Current user's order history         | Required  |
| GET    | `/api/orders/:id`      | Order details (owner or admin)       | Required  |

## Notes

- The cart lives in `localStorage`, so it survives page reloads and doesn't
  require an account to build up — an account is only required at checkout.
- Stock and prices are re-validated against the database when an order is
  placed, not trusted from the client.
- Passwords are hashed with bcrypt; sessions use short-lived JWTs sent as
  `Authorization: Bearer <token>` headers.
