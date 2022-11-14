const User = require('../models/user');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

exports.Login = catchAsyncErrors( async (email, password, res) => {
    try {
        // Finding user in database
        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            ErrorHandler(402, false, 'Invalid Email & Password', res);
            return;
        }
    
        // Checks if password is correct or not
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            ErrorHandler(402, false, 'Invalid Password', res);
            return;
        }

        return user;
    } catch(e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
});