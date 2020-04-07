const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: { 
        user: 'eproject839@gmail.com',
        pass: 'eadproject123@'
    }
});


module.exports = transporter;