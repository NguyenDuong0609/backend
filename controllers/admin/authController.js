const User = require('../../models/user');
const { Login } = require('../../services/Login');
const { Register, ChangePassword, UpdateProfile, GetUserDetails, UpdateUser, DeleteUser } = require('../../services/Admin');

const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');
const sendToken = require('../../utils/jwtToken');
const sendEmail = require('../../utils/sendEmail');
const { changePassword } = require('../../validations/changePassword');
const { updateProfile } = require('../../validations/updateProfile');
const { getUserId } = require('../../validations/admin');

const crypto = require('crypto');
const { send } = require('process');

//Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors( async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await Register(name, email, password, role, res);
        if (user) {
            sendToken(user, 200, res);
        }
    } catch(e) {
        ErrorHandler(500, false, e.message, res);
    }
});

// Login User => /api/v1/login
exports.loginUser = catchAsyncErrors( async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await Login(email, password, res);
        if (user) {
           sendToken(user, 200, res);
        }
    } catch(e) {
        ErrorHandler(500, false, e.message, res);
    }
});

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorHandler('User not found with this email', 401));
    }

    // Get reset token 
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset password url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email send to: ${user.email}`
        })

    } catch(error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    console.log(user);

    if(!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
};

// Update / change password => /api/v1/password/update
exports.updatePassword = async (req, res, next) => {
    try {
        const errors = changePassword(req);
        if (errors.length) {
            ErrorHandler(402, false, errors, res);
            return;
        }
        const { oldPassword, password } = req.body;
        const user = await ChangePassword(oldPassword, password, req, res);
        if (user) {
            sendToken(user, 200, res);
        }
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
    }
};

// Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    try {
        const errors = updateProfile(req);
        if (errors.length) {
            ErrorHandler(402, false, errors, res);
            return;
        }

        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }
    
        UpdateProfile(newUserData, req, res);
    } catch(error) {
        ErrorHandler(500, false, e.message, res);
    }
});

// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    try {
        res.clearCookie('token')
        return res.status(200).json({ success: true, msg: "Logged out"});
    } catch (err) {
        ErrorHandler(500, false, e.message, res);
    }
});

// Admin Routes

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            users
        });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
    }
});

// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        const errors = getUserId(req);
        if (errors.length) {
            ErrorHandler(402, false, errors, res);
            return;
        }

        GetUserDetails(req.params.id, req, res);
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
    }
});

// Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    try {

        const errors = updateProfile(req);
        if (errors.length) {
            ErrorHandler(402, false, errors, res);
            return;
        }

        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }
    
        UpdateUser(newUserData, req, res);
    } catch (error) {
        ErrorHandler(500, false, e.message, res);
    }
});

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    try {
        DeleteUser(req.params.id, res);
    } catch (error) {
        ErrorHandler(500, false, e.message, res);
    }
});