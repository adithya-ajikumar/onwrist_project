const Product = require('../../models/productsSchema');
const Cart = require('../../models/cart');
const mongoose = require('mongoose');

const getcheckout = async (req, res) => {
  try {
    const userId = req.session.user._id;

    // Find the cart and populate product details
    const cart = await Cart.findOne({ userId })
    console.log("cart",cart)
    if (!cart) {
      return res.status(404).render('error', { message: 'Cart not found' });
    }

    // Map cart items to include necessary details
    

    // Calculate total price
    const totalPrice = cart.totalPrice
    console.log('totalPrice', totalPrice)

    console.log('cartItems', cart.items);




    // Render the checkout page
    res.render('checkout', { 
      cartItems: cart.items,
      totalPrice, 
      total: totalPrice, 
      pageTitle: 'Checkout', 
      addresses: req.session.user.addresses || [] 
    });
  } catch (error) {
    console.error('Error getting checkout:', error);
    res.status(500).render('error', { message: 'Could not retrieve checkout at this time.' });
  }
};

module.exports = {
  getcheckout
};