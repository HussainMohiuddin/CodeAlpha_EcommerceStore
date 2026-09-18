const Product = require('../models/Product');

async function listProducts(req, res) {
  const { category, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ products });
}

async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ product });
}

async function createProduct(req, res) {
  const { name, description, price, category, image, stock } = req.body;

  if (!name || !description || price == null || !category) {
    return res.status(400).json({ message: 'name, description, price and category are required' });
  }

  const product = await Product.create({ name, description, price, category, image, stock });
  res.status(201).json({ product });
}

module.exports = { listProducts, getProduct, createProduct };
