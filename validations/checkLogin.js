function checkLogin(req) {
    const { email, password } = req.body;
    // checks if email and password is entered by user
    if (!email || !password) {
        //return new Error("Please enter email & password");
        return ["Please enter email & password"];
    }

    return [];
}

exports.checkLogin = checkLogin;