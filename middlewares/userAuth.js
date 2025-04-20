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

module.exports = {
    isLogin,
    checksession
}