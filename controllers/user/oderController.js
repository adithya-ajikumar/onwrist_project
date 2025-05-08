const express = require('express');
const router = express.Router();
const Order = require('../models/order'); // Assuming you have an Order model


// Get all orders for the logged-in user
router.get('/myorder',  async (req, res) => {
  try {
    // Find all orders for the current user and populate product details
    const orders = await Order.find({ userId: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name images price'
      })
      .populate('shippingAddress')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.render('/myorder', { 
      orders,
      user: req.user,
      title: 'My Orders'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? err : {} 
    });
  }
});

// Get single order details
router.get('/myorder/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.orderId,
      userId: req.user.id 
    })
    .populate({
      path: 'items.product',
      select: 'name images price description'
    })
    .populate('shippingAddress')
    .populate('paymentId');

    if (!order) {
      return res.status(404).render('error', { 
        message: 'Order not found',
        error: { status: 404 }
      });
    }

    res.render('myorder/order-details', { 
      order,
      user: req.user,
      title: `Order #${order.orderId}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? err : {} 
    });
  }
});

module.exports = router;