const User = require('../models/user');

const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');

// checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if(!token) {
        //return next(new ErrorHandler('Login first to access this resource.', 401));
        ErrorHandler(404, false, 'token required', res);
        return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});

// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            // return next(
            //     new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403)
            // )

            return res.status(500).json({ success: false, error: `Role (${req.user.role}) is not allowed to access this resource`})
        }
        next()
    }
}