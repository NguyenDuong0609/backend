const { registerRequest } = require('../validations/registerRequest');
const ErrorHandler = require('../utils/errorHandler');

function Register(req, res, next) {
    const errors = registerRequest(req);

    if (errors.length) {
        ErrorHandler(402, false, errors, res);
        return;
    }

    next();
}

exports.Register = Register;