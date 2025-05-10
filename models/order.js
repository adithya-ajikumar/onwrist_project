const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const OrderSchema = new Schema({
  orderId: {
    type: String, // Changed to String to store UUID
    default: uuidv4, // Automatically generate a UUID
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
      },
      itemStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'processing',
      },
    },
  ],
  couponUsed: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon',
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'processing',
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
