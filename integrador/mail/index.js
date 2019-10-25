'use strict';
const nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');
// var handlebars = require('handlebars');
// var fs = require('fs');

function enviarMail(from, to, subject, text, path, attachments) {
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

    // let readHTMLFile = function(path, callback) {
    //     fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
    //         if (err) {
    //             throw err;
    //             callback(err);
    //         }
    //         else {
    //             callback(null, html);
    //         }
    //     });
    // };

    // readHTMLFile(path, function(err, html) {
    //     var template = handlebars.compile(html);
    //     var replacements = {
    //          username: "John Doe"
    //     };
    //     var htmlToSend = template(replacements);
    // });

    let mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: path,
        attachments: attachments
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error.message);
        }
        console.log('success');
    });

}

module.exports = {
    enviarMail
}