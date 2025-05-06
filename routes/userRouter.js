const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const { isLogin, checksession ,blockCheck} = require('../middlewares/userAuth');
const shopController = require('../controllers/user/shopController');
const multer = require('../middlewares/multer');
const passport = require('passport');
const ProfileController = require('../controllers/user/ProfileController');

router.get("/", blockCheck,userController.loadHome);
router.get("/signup", userController.loadSignup);
router.get("/login", userController.loadLogin);
router.post("/login", userController.signin);
// router.post("/logout", userController.logout);
router.get("/pagenotfound", userController.loadPagenotfound);
router.get ("/forgetpassword",ProfileController.getForgetPassword);
router.get("/userprofile",ProfileController.userprofile)
router.get("/changepassword",ProfileController.changepassword)


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




module.exports = router;
