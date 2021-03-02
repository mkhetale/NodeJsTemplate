const config = require('../config/' + process.env.NODE_ENV + '.json');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(config.email.smtpURL);
const debug = require('debug')('projectname:ne-node:email'); ;

class Email {
  send(from, to, cc, bcc, subject, body, attachments, replyTo) {
    return new Promise((resolve, reject) => {
      // setup e-mail data with unicode symbols
      const mailOptions = {
        from: from.toLowerCase(), // sender address
        to: to.toLowerCase(), // list of receivers
        cc: cc.toLowerCase(),
        bcc: bcc.toLowerCase(),
        subject: subject, // Subject line
        html: body, // html body
        attachments: attachments, // attachemnts
        replyTo: replyTo, // replyTo
      };

      debug('mailOptions: ', mailOptions);

      transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          debug('error: ', err);
          return reject(err);
        }

        debug('response: ', info);

        resolve(info);
      });
    });
  }
}

module.exports = Email;
