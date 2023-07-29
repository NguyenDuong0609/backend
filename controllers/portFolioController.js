var nodemailer = require('nodemailer');
const { postContact } = require("../validations/contactRequest");
const ErrorHandler = require('../utils/errorHandler');

const portFolioController = {
    senContact: async (req, res) => {
        try {
            const errors = await postContact(req);
            if (errors.length) {
                ErrorHandler(402, false, errors, res);
                return;
            }

            var transport = {
                service: process.env.SMTP_SERVICE,
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD
                }
            }
    
            var transporter = nodemailer.createTransport(transport);
            transporter.verify((error, success) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Server is ready to take messages');
                }
            });
    
            var name = req.body.name;
            var subject = req.body.subject;
            var email = req.body.email;
            var message = req.body.message;
            var content = `name: ${name} \nsubject: ${subject} \nemail: ${email} \nmessage: ${message} `;
            const mailOptions = {
                from: name,
                to: process.env.SMTP_TO_EMAIL,
                subject: subject,
                text: content
            };
    
            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    res.status(400).json({
                        error: 'fail'
                    });
                } else {
                    res.status(200).json({ 
                        success: true,
                    });
                }
            });
        } catch (err) {
            ErrorHandler(500, false, err, res);
            return;
        }
    }
}

module.exports = portFolioController;