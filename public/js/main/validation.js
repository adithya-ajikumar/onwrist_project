const validation = (type, value) => {
    switch (type) {
        case "username":
            const regex= /[A-Za-z][A-Za-z0-9_]{7,29}$/
            if (value.length < 3 || value.length > 10) {
                return "Username should be between 3 and 10 characters";
            }else if(regex.test(value)){
                return "Username should  start with capital and alphabets"
            }
            break;
        case "email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return "Invalid email format";
            }
            break;
        case "password":
            if (value.length < 6) {
                return "Password should be at least 6 characters long";
            }
            break;

        // case "confirmpassword":
        //     return null;

        default:
            return null;
    }

    return null;
};
