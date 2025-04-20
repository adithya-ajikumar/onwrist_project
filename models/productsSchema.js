const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  offerprice: {
    type: Number,
    default: 0
  },
  productImage: {
    type: [String],
    required: true
  },
  isListed: {
    type: Boolean,
    default: true
  },
  returnpolicy: {
    type: Boolean,
    default: false
  },
  warranty: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["instock", "outofstock", "available"],
    required: true,
    default: "instock"
  },
  totalStock: {
    type: Number,
    required: true,
    default: 0
  },
  colorStock: {
    silver: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    black: { type: Number, default: 0 },
    // Add more colors if needed
  },
}, { timestamps: true });

// Middleware to calculate totalStock before saving the document
productSchema.pre('save', function(next) {
  this.totalStock = Object.values(this.colorStock).reduce((total, stock) => total + stock, 0);
  next();
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
