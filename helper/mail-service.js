const nodeMailer = require('nodemailer');
const config = require('../config/config');

let transPorter = nodeMailer.createTransport({
    host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'arlene15@ethereal.email',
            pass: 'EREp8Bj1JReN4m9ZgV'
        }
})

async function  sendMail(data) {
    try {
        let mailOptions = {
            from: 'info@ethereal.email',
            to: data.email,
            subject: 'Reset Passwors',
            html: `<h2>Reset Password Link</h2><p>Hi ${data.name}</p>
                <p>Here is your reset password Link</p>
                <p><a href="${config.baseUrl + '/reset-password?email=' + data.email + '&verCode=' + data.verCode }">click here</a></p>`

        };
        const send = await transPorter.sendMail(mailOptions);
        return send;
    }catch(e) {
        return Promise.reject(e);
    }
}

module.exports = {
    sendMail
}