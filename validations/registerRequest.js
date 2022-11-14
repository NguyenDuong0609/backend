function registerRequest(req) {
    const { name, email, password, role } = req.body;
    // checks if email and password is entered by user
    if (!email || !password || !name || !role) {
        //return new Error("Please enter email & password & role");
        return ["Please enter email & password & name & role"];
    }

    return [];
}

exports.registerRequest = registerRequest;