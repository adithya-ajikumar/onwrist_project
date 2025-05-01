




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


const blockCheck = async (req, res, next) => {
    try {
        const userId = req.session.user;
        if (!userId) {
            return next();
        }
          console.log(req.session.user)
        const userData = req.session.user;
        console.log(userData.isBlocked)
        
        if (userData.isBlocked) {
            delete req.session.user
           
           return  res.redirect('/login')   
        }
  
        next();
  
    } catch (error) {
        console.log("Error in block check middleware:", error);
        next();
    }
  };
module.exports = {
    isLogin,
    checksession,
    blockCheck 
}