const express = require('express');
const router = express.Router();
const { loadAddress, addAddress, editAddress } = require('../../controllers/user/addressController');

router.get('/my-address', loadAddress);
router.post('/add-address', addAddress);
router.post('/edit-address', editAddress); // Changed from PUT to POST

module.exports = router;