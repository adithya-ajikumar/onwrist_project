const User = require('../../models/userschema');  
const nodemailer = require("nodemailer");  
const bcrypt = require("bcrypt");
const env = require("dotenv").config(); 
const generateOTP = require("../../utils/genrateOTP"); 
 
const getForgetPassword = async (req, res) => {
    try {
        res.render('forgetpassword');
    } catch (error) {
        console.log(error);
        res.rediect('/pagenotfound');
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Forgot password request:", req.body);
        const user = await User.findOne({ email });
        
        if (!user) {
            res.json({ success: false, message: 'User not found' });
            return res.redirect('/signup');
        }

        const otp = generateOtp();
        console.log("Generated OTP:", otp);

        const sent = await sendResetPasswordOTP(email, otp);
        console.log("selogin", sent);
        
        req.session.otp = otp;
        req.session.email = email;

        res.json({ success: true, message: 'Verification success, OTP sent to your email' });
    } catch (error) {
        console.log(error);
        res.redirect('/pagenotfound');
    }    
};

async function sendResetPasswordOTP(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Your Password Reset OTP",
            text: `Your OTP for resetting your password is: ${otp}`,
            html: `<p>Your OTP for resetting your password is: <strong>${otp}</strong></p>`
        };

        await transporter.sendMail(mailOptions);
        console.log("Password reset OTP sent to:", email);

        return true;
    } catch (error) {
        console.error("Error sending password reset OTP:", error);
        return false;
    }
}

function generateOtp() {
    
    return Math.floor(100000 + Math.random() * 900000).toString(); 
}

const otpVerify = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log("OTP verification request:", req.body);
       
        if (otp === req.session.otp) {
            res.json({ success: true, message: 'OTP verified successfully' });
        } else {
            res.json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        res.json({ success: false, message: "Internal server error" });
    }
};

const resendOtp = async (req, res) => {
    try {
        console.log("Resend OTP request:");
        const email = req.session.email; // Assuming email is stored in session
        console.log("email", email);

        if (!email) {
            return res.json({ success: false, message: "Email not found in session." });
        }

        const otp = generateOtp();
        console.log("Generated OTP for resend:", otp);
        req.session.otp = otp;

        const emailSent = await sendResetPasswordOTP(email, otp);
        console.log("Email sent status:", emailSent);
    
        return res.json({ success: true, message: "OTP resent successfully." });
    } catch (error) {
        console.error("Error resending OTP:", error);
        res.json({ success: false, message: "Failed to send OTP" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const email = req.session.email;

        if (!email) {
            return res.json({ success: false, message: 'Session expired. Please try again.' });
        }

        if (password !== confirmPassword) {
            return res.json({ success: false, message: 'Passwords do not match' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.json({ success: false, message: 'Internal server error' });
    }
};

const userprofile = async (req, res) => {
    try {
        const userId = req.session.user;
        const userData = await User.findOne(userId);
        res.render("userprofile", {
            user: userData
        });
    } catch (error) {
        console.log("error in the profile management page");
        res.redirect("/pagenotfound");
    }
};

const editprofile = async (req, res) => {
    try {
        const userId = req.session.user._id; // Assuming you have user authentication middleware
        const { name, email, phone } = req.body;

        console.log('1');
        
        // Find the user by ID and update the fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, phone },
            { new: true, runValidators: true }
        );

        console.log('2', updatedUser);

        if (!updatedUser) {
            return res.json({ success: false, message: 'User not found' });
        }

        console.log("3");
        
        // Send a success response
        res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Internal Server Error' });
    }
};

const changepasswordotp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Change password OTP request:", req.body);



        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

       console.log("error before the otp")
        const otp = generateOtp();
        console.log("Generated OTP:", otp);

        // Send OTP via email
        const sent = await sendResetPasswordOTP(email, otp);
        if (!sent) {
            return res.json({ success: false, message: 'Failed to send OTP' });
        }

        // Store OTP and email in session
        req.session.otp = otp;
        req.session.email = email;

        res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.json({ success: false, message: 'Internal server error' });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log("OTP verification request:", req.body);

        if (otp === req.session.otp) {
            res.json({ success: true, message: 'OTP verified successfully' });
        } else {
            res.json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.json({ success: false, message: 'Internal server error' });
    }
};


module.exports = {
    getForgetPassword,
    forgotPassword,
    otpVerify,
    resendOtp,
    resetPassword,
    userprofile,
    editprofile,
    verifyOtp,
    changepasswordotp
};
