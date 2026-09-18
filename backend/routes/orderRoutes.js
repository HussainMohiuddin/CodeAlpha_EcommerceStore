const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, getOrder } = require('../controllers/orderController');

const router = express.Router();

router.use(protect);
router.post('/', asyncHandler(createOrder));
router.get('/mine', asyncHandler(getMyOrders));
router.get('/:id', asyncHandler(getOrder));

module.exports = router;
