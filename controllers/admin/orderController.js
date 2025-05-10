const Address = require('../../models/addressSchema'); 
const Order = require('../../models/order');    
const Cart = require('../../models/cart');
const mongoose = require('mongoose');
const User = require('../../models/userschema');


const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'items.product',
                select: 'productName productImage'
            })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        const formattedOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                status: order.orderStatus, // Updated to match schema
                createdOn: order.createdAt, // Updated to match schema
                totalAmount: order.totalPrice, // Updated to match schema
                orderItems: order.items.map(item => ({
                    product: {
                        name: item.product ? item.product.productName : 'Product Unavailable',
                        image: item.product && item.product.productImage.length > 0 
                            ? item.product.productImage[0] 
                            : 'default.jpg'
                    },
                    quantity: item.quantity,
                    price: item.price,
                    color: item.color,
                    itemStatus: item.itemStatus
                }))
            };
        });

        res.render('adminOrders', { 
            orders: formattedOrders, 
            title: 'All Orders'
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllOrders,
   
};