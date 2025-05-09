const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const { isLogin, checksession ,blockCheck} = require('../middlewares/userAuth');
const shopController = require('../controllers/user/shopController');
const multer = require('../middlewares/multer');
const passport = require('passport');
const ProfileController = require('../controllers/user/ProfileController');
const AddressController = require('../controllers/user/addressController');
const cartcontroller=require('../controllers/user/cartcontroller')
const checkoutController = require('../controllers/user/checkoutcontroller');
const orderController = require('../controllers/user/orderController');

router.get("/", blockCheck,userController.loadHome);
router.get("/signup", userController.loadSignup);
router.get("/login", userController.loadLogin);
router.post("/login", userController.signin);
// router.post("/logout", userController.logout);
router.get("/pagenotfound", userController.loadPagenotfound);
router.get("/forgetpassword",ProfileController.getForgetPassword)
router.get("/userprofile",ProfileController.userprofile)
router.post("/change-password",ProfileController.changepasswordotp)
router.post('/verify-otp',ProfileController.verifyOtp);
router.post('/reset-password', ProfileController.resetPassword);


// Auth routes
router.post("/auth/register", userController.signup);
router.get('/verify-otp', isLogin, userController.loadVerifyOtp);
router.post("/verify-otp", userController.verifyOtp);
router.post("/resend-otp", userController.resendOtp);




router.post("/forgot-password", ProfileController.forgotPassword);
router.post('/otp-verify', ProfileController.otpVerify);
router.post('/resendOtp', ProfileController.resendOtp);
router.post('/update-password', ProfileController.resetPassword);

// router.post('/reset-password', ProfileController.resetPassword);
///profile
router.post('/edit-profile',ProfileController.editprofile);


router.get("/shop", shopController.getShopPage);
router.get('/productDetails/:id', shopController.loadProductDetails);

router.get('/auth/google', (req, res, next) => {
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
    passport.authenticate(
        "google",
        {
            failureRedirect: "/register",
        },
        (err, user, info) => {

            console.log("User info:", user);
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect("/register");
            }
            req.session.user = user;
            req.session.isLoggedIn = true;
            return res.redirect("/");
        }
    )(req, res, next);
}
);
////addressmangment
router.get('/myaddress', AddressController.loadAddress);   
router.post('/add-address', AddressController.addAddress);
router.post('/edit-address', AddressController.editAddress);
router.post('/delete-address', AddressController.deleteAddress);


  //cart managment 
  router.get('/cart',isLogin, cartcontroller.getCart);
  router.post('/add', cartcontroller.addToCart);
  router.post('/update', cartcontroller.updateCartItem);
  router.post('/remove',  cartcontroller.removeCartItem);
  router.post('/clear',cartcontroller.clearCart);
  
  ////checkout
  router.get('/checkout', isLogin,checkoutController.getCheckoutPage);
  router.post('/addAddress', checkoutController.addAddress);


////ordercontroller
router.get('/myorder', isLogin, orderController.getOrders);
router.get('/myorder/:orderId', isLogin, orderController.getOrderDetails);






















module.exports = router;
