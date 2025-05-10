const Product = require('../../models/productsSchema');
const Cart = require('../../models/cart');
const Address = require('../../models/addressSchema'); // Assuming you have an Address model
const Order = require('../../models/order'); // Import the Order model
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

const addAddress = async (req, res) => {
  try {
    console.log("Adding address:", req.body);
    const userId = req.session.user._id;
    const newAddress = req.body;

    // Find the user's address document or create a new one
    let userAddressDoc = await Address.findOne({ userId });
    if (!userAddressDoc) {
      userAddressDoc = new Address({ userId, address: [] });
    }

    // Add the new address to the address array
    userAddressDoc.address.push(newAddress);
    await userAddressDoc.save();

    // Return the newly added address and its index
    const addedAddressIndex = userAddressDoc.address.length - 1;
    res.status(200).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
      index: addedAddressIndex,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: "Failed to add address" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { addressId, totalAmount } = req.body;

    console.log("Placing order with addressId:", addressId, "and totalAmount:", totalAmount);

    // Extract the actual address ID from the combined value
    const actualAddressId = addressId.split('-')[0];

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId", "price");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }

    // Create the order items from the cart
    const orderItems = cart.items.map(item => ({
      product: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
      color: item.color,
      itemStatus: "processing", // Default status for each item
    }));

    console.log("Order Items:", orderItems);

       const orders = [];
    for (const item of cart.items) {
      const newOrder = new Order({
        userId,
        items: [
          {
            product: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
            color: item.color,
            itemStatus: "Processing", // Default status for each item
          },
        ],
        shippingAddress: actualAddressId,
        totalPrice: item.quantity * item.productId.price, // Calculate total price for this item
        orderStatus: "Processing", // Default status for the order
      });

      await newOrder.save();
      
    }


    // Clear the user's cart after placing the order
    await Cart.deleteOne({ userId });

    console.log("Order placed successfully!");

    res.json({
      success: true,
      message: "Order placed successfully!",
      
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Failed to place order." });
  }
};

module.exports = {
  getCheckoutPage,
  addAddress,
  placeOrder,
};



