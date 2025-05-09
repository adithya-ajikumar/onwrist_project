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

        console.log('Formatted Orders:', formattedOrders);

        res.render('adminOrders', { 
            orders: formattedOrders, 
            title: 'All Orders'
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server Error');
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Fetch the order details
        const order = await Order.findOne({ orderId })
            .populate('userId', 'name email')
            .populate({
                path: 'items.product',
                select: 'productName productImage',
            })
            
     const shippingAddress = await Address.findOne({userId:order.userId}) 
      const address = shippingAddress.address.find(address => address._id.toString() === order.shippingAddress.toString());
      console.log('Address:', address); 


        if (!order) {
            return res.status(404).send('Order Not Found');
        }




        // Pass the order and address data to the view
        res.render('adminOrderdetails', {
            order,
            address: order.shippingAddress,
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Server Error');
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;

        console.log('Updating order status:', orderId, status);

        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Request', 'Returned'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update the orderStatus field in the Order schema
        for(const item of order.items) {
            item.itemStatus = status;
            order.orderStatus = status;
            order.save();
        }

        console.log('Updated Order:', order);

        

        res.json({ success: true, message: 'Order status updated successfully', status: order.orderStatus });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};


module.exports = {
    getAllOrders,
    getOrderDetails,
    updateOrderStatus
};