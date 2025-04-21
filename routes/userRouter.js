const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const { isLogin, checksession } = require('../middlewares/userAuth');
const shopController = require('../controllers/user/shopController');
const multer = require('../middlewares/multer');


router.get("/",checksession,userController.loadHome);
router.get("/signup", userController.loadSignup);
router.get("/login", userController.loadLogin);
router.post("/login", userController.signin);
// router.post("/logout", userController.logout);
router.get("/pagenotfound",userController.loadPagenotfound);

// Auth routes
router.post("/auth/register", userController.signup);
router.get('/verify-otp',isLogin,userController.loadVerifyOtp);
router.post("/verify-otp", userController.verifyOtp);
router.post("/resend-otp", userController.resendOtp);




router.get("/shop",shopController.getShopPage);
router.get('/productDetails/:id',shopController.loadProductDetails);




module.exports = router;
