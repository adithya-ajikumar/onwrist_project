const Address=require("../../models/addressSchema");
const User = require('../../models/userschema');

const loadAddress = async (req, res) => {   
    try {
        const userId = req.session.user._id;
        console.log("User session:", userId);

        // Fetch the user's addresses
        const addresses = await Address.findOne({ userId }).populate('userId', 'name email phone');
        const user = await User.findById(userId);

        console.log("Addresses:", addresses);

        // Pass the user and addresses to the view
        res.render('myaddress', { user, addresses: addresses ? addresses.address : [] });
    } catch (error) {
        console.error("Error loading address:", error);
        res.redirect('/pagenotfound');
    }
};


const addAddress = async (req, res) => {
    try {
        console.log("Adding address...");
        console.log("Request body:", req.body);
        const userId = req.session.user._id;

        console.log("User ID:", userId);
        const { address, name, city, state, country, landMark, flatNumber, pincode, phone } = req.body;
        console.log("User session:", userId);
        console.log("Address data:", req.body);

        const newAddress = new Address({
            userId,
            address: [{
                address,
                name,
                city,
                state,
                country,
                landMark,
                flatNumber,
                pincode,
                phone
            }]
        });

        console.log("New address:", newAddress);

        await newAddress.save();
        res.status(200).json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ success: false, message: "Failed to add address" });
    }
};


module.exports = { 
    loadAddress,
    addAddress
 }