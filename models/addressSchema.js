const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    address: [{
        address: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        landMark: {
            type: String,
            required: true,
        },
        flatNumber: {
            type: Number,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
    }]
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
