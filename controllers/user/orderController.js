const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const Address = require('../../models/addressSchema'); // Import the Address model

// Get all orders for the logged-in user
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.session.user._id })
      .populate('items.product', 'productName productImage price') // Correct field names
      .populate('shippingAddress') // Populate shipping address
      .sort({ createdAt: -1 }); // Sort by creation date (newest first)

    console.log('Orders:', orders);

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
      .populate('items.product', 'productName productImage price').populate('shippingAddress') // Populate shipping address
      .sort({ createdAt: -1 }); // Sort by creation date (newest first)
      
      // Populate product details
      
      console.log('Order Details:', order); 

      const orders = await Order.findOne({ orderId: req.params.orderId })

      console.log('Orders:', orders); // Log the orders

      const shippingAddress = await Address.findOne({userId: req.session.user._id})
      const address = shippingAddress.address.find(address => address._id.toString() === orders.shippingAddress.toString());
      console.log('Address:', address); // Log the address

       // Log the shipping address
      // Populate shipping address

    if (!order) {
      return res.status(404).render('error', {
        message: 'Order not found',
        error: { status: 404 }
      });
    }

    res.render('orderFullDetails', {
      order,
      address,
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

// Cancel an order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            orderId,
            userId: req.session.user._id
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.orderStatus !== 'processing') {
            return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.json({ success: true, message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
  getOrders,
  getOrderDetails,
  cancelOrder
};