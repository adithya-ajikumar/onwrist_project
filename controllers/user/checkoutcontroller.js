const Product = require('../../models/productsSchema');
const Cart = require('../../models/cart');
const Address = require('../../models/addressSchema'); // Assuming you have an Address model
const mongoose = require('mongoose');

const getCheckoutPage = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.user) {
      return res.redirect("/signin");
    }

    const userId = req.session.user._id;

    // Fetch the cart and populate product details
    const cart = await Cart.findOne({ userId }).populate("items.productId", "productName productImage price");
    console.log("Cart Data:", cart);

    // Fetch user addresses
    const userAddressDoc = await Address.findOne({ userId });

    let cartItems = [];
    let totalAmount = 0;
    let userAddresses = userAddressDoc ? userAddressDoc.address : [];

    console.log("User Addresses:", userAddresses);

    // Process cart items if the cart exists and has items
    if (cart && cart.items.length > 0) {
      cartItems = cart.items.map(item => ({
        productId: item._id,
        productName: item.productId.productName, // Accessing the populated productName
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        image: item.productId.productImage && item.productId.productImage.length > 0 ? item.productId.productImage[0] : "/default-image.jpg",
        totalPrice: item.quantity * item.price
      }));

      // Calculate the total amount
      totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    }

    console.log("Processed Cart Items:", cartItems);

    // Render the checkout page
    res.render("checkout", {
      cartItems,
      userAddresses,
      totalAmount
    });
  } catch (error) {
    console.error("Error in getCheckoutPage:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getCheckoutPage
};



