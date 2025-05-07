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

        // Find the user's address document
        const userAddress = await Address.findOne({ userId });

        if (userAddress) {
            // If the user already has an address document, push the new address into the array
            userAddress.address.push({
                address,
                name,
                city,
                state,
                country,
                landMark,
                flatNumber,
                pincode,
                phone
            });

            await userAddress.save();
            res.status(200).json({ success: true, message: "Address added successfully" });
        } else {
            // If no address document exists, create a new one
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

            await newAddress.save();
            res.status(200).json({ success: true, message: "Address added successfully" });
        }
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ success: false, message: "Failed to add address" });
    }
};


const editAddress = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { addressId, address, name, city, state, country, landMark, flatNumber, pincode, phone } = req.body;

        const userAddress = await Address.findOne({ userId });
        if (!userAddress) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        const addressToEdit = userAddress.address.id(addressId);
        if (!addressToEdit) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        // Update the address fields
        addressToEdit.address = address;
        addressToEdit.name = name;
        addressToEdit.city = city;
        addressToEdit.state = state;
        addressToEdit.country = country;
        addressToEdit.landMark = landMark;
        addressToEdit.flatNumber = flatNumber;
        addressToEdit.pincode = pincode;
        addressToEdit.phone = phone;

        await userAddress.save();
        res.status(200).json({ success: true, message: "Address updated successfully" });
    } catch (error) {
        console.error("Error editing address:", error);
        res.status(500).json({ success: false, message: "Failed to edit address" });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { addressId } = req.body;

        const userAddress = await Address.findOne({ userId });
        if (!userAddress) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        // Find the index of the address to delete
        const addressIndex = userAddress.address.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        // Use splice to remove the address
        userAddress.address.splice(addressIndex, 1);

        await userAddress.save();

        res.status(200).json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ success: false, message: "Failed to delete address" });
    }
};

module.exports = { 
    loadAddress,
    addAddress,
    editAddress,
    deleteAddress
};