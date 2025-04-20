const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  expiredate: {
    type: Date,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  minimumPurchase: {
    type: Number,
    default: 0
  },
  userId: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  coupenCode: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String
  },
  totalcount: {
    type: Number,
    default: 0
  },
  peruserlimit: {
    type: Number,
    default: 1
  },
  maxdiscount: {
    type: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);  