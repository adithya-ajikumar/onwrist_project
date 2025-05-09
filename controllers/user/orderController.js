const express = require('express');
const router = express.Router();
const Order = require('../../models/order');

// Get all orders for the logged-in user
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.session.user._id })
      .populate('items.product', 'name images price')
      .populate('shippingAddress')
      .sort({ createdAt: -1 });

    res.render('myorder', {
      orders,
      user: req.session.user,
      title: 'My Orders'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).render('error', {
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Get single order details
const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      userId: req.session.user._id
    })
      .populate('items.product', 'name images price description')
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
      user: req.session.user,
      title: `Order #${order.orderId}`
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).render('error', {
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

module.exports = {
  getOrders,
  getOrderDetails
};