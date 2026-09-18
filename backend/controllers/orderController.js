const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

async function createOrder(req, res) {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }
  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address ||
      !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    return res.status(400).json({ message: 'Complete shipping address is required' });
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    if (!mongoose.isValidObjectId(item.productId) || !item.quantity || item.quantity < 1) {
      return res.status(400).json({ message: 'Each item needs a valid productId and quantity >= 1' });
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${item.productId}` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for "${product.name}" (available: ${product.stock})` });
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
    totalAmount += product.price * item.quantity;

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
  });

  res.status(201).json({ order });
}

async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
}

async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view this order' });
  }
  res.json({ order });
}

module.exports = { createOrder, getMyOrders, getOrder };
