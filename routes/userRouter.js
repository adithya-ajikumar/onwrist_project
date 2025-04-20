const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const { isLogin, checksession } = require('../middlewares/userAuth');


router.get("/",checksession,userController.loadHome);
router.get("/signup",isLogin, userController.loadSignup);
router.get("/login",isLogin, userController.loadLogin);
router.post("/login", userController.signin);
// router.post("/logout", userController.logout);
router.get("/pagenotfound",userController.loadPagenotfound);

// Auth routes
router.post("/auth/register", userController.signup);
router.get('/verify-otp',isLogin,userController.loadVerifyOtp);
router.post("/verify-otp", userController.verifyOtp);
router.post("/resend-otp", userController.resendOtp);




module.exports = router;
