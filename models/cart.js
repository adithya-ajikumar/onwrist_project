const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product', // Reference to the Product model
    required: true
  },
  color: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coupnId: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  items: [CartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);