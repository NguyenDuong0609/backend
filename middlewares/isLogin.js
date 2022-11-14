const { checkLogin } = require('../validations/checkLogin');
const ErrorHandler = require('../utils/errorHandler');

function isLogin(req, res, next) {
    const errors = checkLogin(req);

    if (errors.length) {
        ErrorHandler(402, false, errors, res);
        return;
    }

    next();
}

exports.isLogin = isLogin;