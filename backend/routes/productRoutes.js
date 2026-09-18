const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { listProducts, getProduct, createProduct } = require('../controllers/productController');

const router = express.Router();

router.get('/', asyncHandler(listProducts));
router.get('/:id', asyncHandler(getProduct));
router.post('/', protect, requireAdmin, asyncHandler(createProduct));

module.exports = router;
