const User = require('../../models/userschema');  
const nodemailer = require("nodemailer");   
 
 
 
 const getForgetPassword = async (req, res) => {
    try {
        res.render('forgetpassword');
    } catch (error) {
        console.log(error);
        res.rediect('/pagenotfound');
    }
};


const forgotPassword=async(req,res)=>{
    try {
        

        const { email } = req.body;
        console.log("Forgot password request:", req.body);
        const user = await User .findOne({ email });
        
        if(!user) {
            res.json({ success:false, message: 'User not found' });
            return res.redirect('/signup');
        }


        const otp=generateOtp();
        console.log("Generated OTP:", otp);

        const sent =await sendResetPasswordOTP(email, otp);
        console.log("selogin",sent);
        
        req.session.otp=otp;
        req.session.email=email;


        res.json({ success:true, message: 'Verification success,OTP sent to your email' });



    } catch (error) {
        console.log(error);
        res.redirect('/pagenotfound');
    }    

}
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
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                  `Please use the following OTP to reset your password:\n\n` +
                  `${otp}\n\n` +
                  `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);
        console.log("Password reset OTP sent to: " + email);
    } catch (error) {
        console.error("Error sending password reset OTP: ", error);
    }
}



function generateOtp() {
  
    return Math.floor(100000 + Math.random() * 900000).toString(); 
}


const otpVerify=async(req,res)=>{
    try {
        const { otp } = req.body;
        console.log("OTP verification request:", req.body);
        if (otp === req.session.otp) {
            res.json({ success:true, message: 'OTP verified successfully' });
           
        } else {
            res.json({ success:false, message: 'Invalid OTP' });
            
        }
    } catch (error) {
        res.json({success:false,message:"Internal server error"})
    }
}



const resendOtp = async (req, res) => {
    try {
        console.log("Resend OTP request:");
        const email= req.session.email// Assuming email is stored in session
        console.log("emial", email);

        if (!email) {
            return res.json({ success: false, message: "Email not found in session.//////////////////////" });
        }

        const otp =generateOtp()
        console.log("Generated OTP for resend:", otp);
        req.session.otp = otp;

        const emailSent = await sendResetPasswordOTP(email,otp);
        console.log("Email sent status:", emailSent);
    
        return res.json({ success: true, message: "OTP resent successfully." });
        
    } catch (error) {
        console.error("Error resending OTP:", error);
        res.json({ success: false, message: "Internal Server Error. Please try again." });
    }
};





module.exports = {
    getForgetPassword,
    forgotPassword,
    otpVerify,
    resendOtp

   
}
