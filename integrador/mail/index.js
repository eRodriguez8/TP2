'use strict';
const nodemailer = require('nodemailer');
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'tp2ort.integrador@gmail.com',
            pass: 'marianoort'
        }
    });

    let mailOptions = {
        from: 'tp2ort.integrador@gmail.com',
        to: 'pablorozek@gmail.com;rodriguez.emanuel14@gmail.com;tp2ort.integrador@gmail.com',
        subject: 'miravo',
        text: 'sos crack pablo',
        html: 
            '<p><b>Hola</b> puto el que lee</p>' +
            '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',
        attachments: [{
            filename: 'nyan cat ✔.gif',
            path: __dirname + '/assets/nyan.gif',
            cid: 'nyan@example.com' // should be as unique as possible
        }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error.message);
        }
        console.log('success');
    });
}
main()