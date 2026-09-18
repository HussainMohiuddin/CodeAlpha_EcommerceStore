require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 79.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/headphones/500/500',
    stock: 25,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking smart watch with heart-rate monitor, GPS, and 7-day battery life.',
    price: 129.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/smartwatch/500/500',
    stock: 15,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with hot-swappable switches.',
    price: 59.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/keyboard/500/500',
    stock: 30,
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Soft, breathable 100% cotton t-shirt available in multiple colors.',
    price: 14.99,
    category: 'Clothing',
    image: 'https://picsum.photos/seed/tshirt/500/500',
    stock: 100,
  },
  {
    name: 'Denim Jacket',
    description: 'Classic fit denim jacket, durable and stylish for everyday wear.',
    price: 49.99,
    category: 'Clothing',
    image: 'https://picsum.photos/seed/jacket/500/500',
    stock: 40,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned soles for all-day comfort.',
    price: 69.99,
    category: 'Footwear',
    image: 'https://picsum.photos/seed/shoes/500/500',
    stock: 50,
  },
  {
    name: 'Ceramic Coffee Mug',
    description: '12oz ceramic mug, microwave and dishwasher safe.',
    price: 9.99,
    category: 'Home',
    image: 'https://picsum.photos/seed/mug/500/500',
    stock: 80,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12.',
    price: 19.99,
    category: 'Home',
    image: 'https://picsum.photos/seed/bottle/500/500',
    stock: 60,
  },
  {
    name: 'Backpack',
    description: 'Water-resistant backpack with padded laptop compartment.',
    price: 39.99,
    category: 'Accessories',
    image: 'https://picsum.photos/seed/backpack/500/500',
    stock: 35,
  },
  {
    name: 'Sunglasses',
    description: 'Polarized sunglasses with UV400 protection.',
    price: 24.99,
    category: 'Accessories',
    image: 'https://picsum.photos/seed/sunglasses/500/500',
    stock: 45,
  },
];

async function run() {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products.`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
