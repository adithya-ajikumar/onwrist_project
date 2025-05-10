// controllers/cartController.js
const Cart =require("../../models/cart")
const Product = require('../../models/productsSchema'); // Assuming you have a Product model
const Coupon = require('../../models/Coupons'); // Assuming you have a Coupon model
const mongoose = require('mongoose');


const getCart = async (req, res) => {
  try {
    
    const userId =req.session.user._id

    
    if(!userId){

       return res.json({message:"user not found"})
  

    }
    let cart = await Cart.findOne({ userId }).populate('items.productId', 'productName productImage price');
    console.log('cart',cart)


    for (let item of cart.items) {
      item.productName = item.productId.productName;
      item.image = item.productId.productImage && item.productId.productImage.length > 0 ? item.productId.productImage[0] : '/default-image.jpg';
      item.totalPrice = item.price * item.quantity;
    }

    console.log('prductId',cart.items[0].productId)
    console.log('productName',cart.items[0].productName)

    console.log('cart after populating',cart)
    
   
    if (!cart) {
      cart = new Cart({
        userId,
        totalPrice: 0,
        items: []
      });
      await cart.save();
    }

   

    res.render('cart', { 
      cart,
      
      pageTitle: 'Your Shopping Cart'
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).render('error', { 
      message: 'Could not retrieve your cart at this time.'
    });
  }
};

// Update item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log(req.body)
    const userId = req.session.user._id;

    // Validate quantity
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.productId == productId);
    console.log('itemIndex',itemIndex)
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantityNum;

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Quantity updated successfully' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Could not update cart item' });
  }
};

// Remove item from cart
 const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log('req.body',req.body)
    const userId = req.session.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    console.log('cart',cart)
    console.log('productId',productId)
   

    // Remove the item from the cart
    const itemIndex = cart.items.findIndex(item => item.productId == productId);
    console.log('itemIndex',itemIndex)
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    console.log('cart after removing item',cart)

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Could not remove item from cart' });
  }
};

// Apply coupon to cart
const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const userId = req.user ? req.user._id : '64a5e4e31b7d44ce5f8c1234'; // Example userId
    
    // Find the coupon by code
    
    
    
    // Check if coupon is expired
    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      req.flash('error', 'Coupon has expired');
      return res.redirect('/cart');
    }
    
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      req.flash('error', 'Cart not found');
      return res.redirect('/cart');
    }
    
    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cart.totalPrice * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discount = coupon.value;
    }
    
    // Apply discount to cart
    cart.coupnId = coupon._id; // Note the typo in schema: coupnId
    cart.totalPrice = Math.max(0, cart.totalPrice - discount);
    
    // Save the updated cart
    await cart.save();
    
    // Redirect back to cart
    req.flash('success', 'Coupon applied successfully');
    res.redirect('/cart');
  } catch (error) {
    console.error('Error applying coupon:', error);
    req.flash('error', 'Could not apply coupon');
    res.redirect('/cart');
  }
};

// Remove coupon from cart
exports.removeCoupon = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : '64a5e4e31b7d44ce5f8c1234'; // Example userId
    
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      req.flash('error', 'Cart not found');
      return res.redirect('/cart');
    }
    
    // Remove coupon and recalculate total price
    cart.coupnId = null;
    
    // Recalculate total price without discount
    let totalPrice = 0;
    for (const item of cart.items) {
      totalPrice += item.price * item.quantity;
    }
    cart.totalPrice = totalPrice;
    
    // Save the updated cart
    await cart.save();
    
    // Redirect back to cart
    req.flash('success', 'Coupon removed');
    res.redirect('/cart');
  } catch (error) {
    console.error('Error removing coupon:', error);
    req.flash('error', 'Could not remove coupon');
    res.redirect('/cart');
  }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { productId, color, quantity } = req.body;
        console.log('req.body',req.body)
        const userId = req.session.user._id;

        console.log('userId',userId)

        // Find the product to get its price
        const product = await Product.findById(productId);
        console.log('product',product)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Validate quantity
        const quantityNum = parseInt(quantity) || 1;
        if (isNaN(quantityNum) || quantityNum < 1) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        // Find or create the user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                totalPrice: 0,
                items: [],
            });
        }

        // Check if the product already exists in the cart
        const itemIndex = cart.items.findIndex(
            (item) => item.productId == productId && item.color == color
        );

        if (itemIndex > -1) {
            // If item exists, update quantity
            cart.items[itemIndex].quantity += quantityNum;
        } else {
            // Otherwise, add new item
            cart.items.push({
                productId,
                color,
                price: product.price,
                quantity: quantityNum,
            });
        }

        // Recalculate total price
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Save the cart
        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Could not add item to cart' });
    }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : '64a5e4e31b7d44ce5f8c1234'; // Example userId
    
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      req.flash('error', 'Cart not found');
      return res.redirect('/cart');
    }
    
    // Clear items and reset total
    cart.items = [];
    cart.totalPrice = 0;
    cart.coupnId = null;
    
    // Save the updated cart
    await cart.save();
    
    // Redirect back to cart
    req.flash('success', 'Cart cleared');
    res.redirect('/cart');
  } catch (error) {
    console.error('Error clearing cart:', error);
    req.flash('error', 'Could not clear cart');
    res.redirect('/cart');
  }
};


module.exports = {
 
  removeCartItem,
  getCart,
  updateCartItem,
  addToCart,
  clearCart,
  applyCoupon,
  

 
};