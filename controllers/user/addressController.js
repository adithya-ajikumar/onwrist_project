const Address=require("../../models/addressSchema");
const User = require('../../models/userschema');

const loadAddress = async (req, res) => {   
    try {
        const userId = req.session.user._id;
        console.log("User session:", userId);
        const addresses = await Address.findOne({ userId }).populate('userId', 'name email phone');
        const user= await User.findById(userId);
        console.log("Addresses:", addresses);
        res.render('myaddress', { user, addresses });
    } catch (error) {
        console.error("Error loading address:", error);
        res.redirect('/pagenotfound');
    }
}
module.exports = { 
    loadAddress
 }