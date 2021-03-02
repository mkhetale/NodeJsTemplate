const config = require('../config/' + process.env.NODE_ENV + '.json');
let NE = require('../ne-node');
let Template = require('../template');

NE = new NE();
Template = new Template();

class Email {
  constructor() {
    this.from = config.email.fromEmail;
    this.replyTo = config.email.replyTo;
  }

  send(to, cc, bcc, subject, type, obj, attachments) {
    return new Promise((resolve, reject) => {
      Template.generate(`email/${type}`, obj)
        .then((result) => {
          return NE.email.send(this.from, to, cc, bcc, subject, result, attachments, this.replyTo);
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }
}

module.exports = Email;
