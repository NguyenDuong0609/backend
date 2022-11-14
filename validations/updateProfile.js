function updateProfile(req) {
    const { name, email, role } = req.body;
    // checks if email and password is entered by user
    if (!name || !email || !role) {
        return ["Please enter name & email & role"];
    }

    return [];
}

exports.updateProfile = updateProfile;