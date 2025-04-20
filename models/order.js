const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const{v4:uuidv4}=require('uuid');


const OrderSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
         default:()=>uuidv4(),
         unique:true
      },


  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    color: {
      type: String
    },
    itemstatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },
    price: {
      type: String
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  CoupenUsed: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  orderstatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  totalprice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);