let SMS = require('./sms.js');
let Email = require('./email.js');
SMS = new SMS();
Email = new Email();

class NE {
  constructor() {
    this.sms = SMS;
    this.email = Email;
  }
}

module.exports = NE;
