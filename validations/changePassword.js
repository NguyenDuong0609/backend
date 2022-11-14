function changePassword(req) {
    const { oldPassword, password } = req.body;
    // checks if email and password is entered by user
    if (!oldPassword || !password) {
        //return new Error("Please enter email & password");
        return ["Please enter old password & password"];
    }

    return [];
}

exports.changePassword = changePassword;