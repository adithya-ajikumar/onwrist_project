const isLogin=  (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}




const checksession = (req, res, next) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        next();
    }
}

const authMiddleware = (req,res,next)=>{
    const protectedRoutes = ["/profile", "/cart", "/checkout", "/orders"];
    const notProtectedRoutes = ["/login", "/signup", "/forgot-password"];
    // if()
}

module.exports = {
    isLogin,
    checksession
}