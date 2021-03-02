let NE = require('../ne-node');
let Template = require('../template');

NE = new NE();
Template = new Template();


class SMS {
  send(numbers, type, obj) {
    return new Promise((resolve, reject) => {
      Template.generate(`sms/${type}`, obj)
        .then((result) => {
          return NE.sms.send({
            number: numbers,
            text: result,
          });
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }
}

module.exports = SMS;
