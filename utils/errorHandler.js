// Error Handler Class
// class ErrorHandler extends Error {
//     constructor(message, statusCode) {
//         super(message);
//         this.statusCode = statusCode;

//         //Error.captureStackTrace(this, this.constructor)
//     }
// }

function ErrorHandler(status, success, message, res) {
    res.status(status).json({
        success: success,
        message: message
    });
}

module.exports = ErrorHandler;