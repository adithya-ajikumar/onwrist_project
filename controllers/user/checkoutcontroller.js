const Product =require('../../models/productsSchema')
const Cart = require('../../models/cart');
const mongoose = require('mongoose');

const getcheckout = async (req, res) => {
  try {
    const userId = req.session.user._id;

    // Find the cart and populate product details
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.render('checkout', { 
        cartItems: [], 
        totalPrice: 0, 
        shipping: 0, 
        tax: 0, 
        total: 0, 
        pageTitle: 'Checkout', 
        addresses: req.session.user.addresses || [] 
      });
    }

    // Map cart items to include necessary details
    const cartItems = cart.items.map(item => ({
      name: item.productId?.name || 'Unknown Product',
      image: item.productId?.image || '/images/placeholder.jpg',
      size: item.color || 'N/A',
      quantity: item.quantity || 0,
      price: item.productId?.price || 0
    }));

    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Set shipping and tax to zero
    const shipping = 0;
    const tax = 0;
    const total = totalPrice + shipping + tax;

    // Render the checkout page
    res.render('checkout', { 
      cartItems, 
      totalPrice, 
      shipping, 
      tax, 
      total, 
      pageTitle: 'Checkout', 
      addresses: req.session.user.addresses || [] 
    });
  } catch (error) {
    console.error('Error getting checkout:', error);
    res.status(500).render('error', { message: 'Could not retrieve checkout at this time.' });
  }
};
  
module.exports={
    getcheckout
}