// const assert = require('chai').assert;
// const debug = require('debug')('projectname:notify:test');
// let Notify = require('../notify');
// Notify = new Notify();

// describe('Notify', function() {
//   // User commer seperate numbers to send to multiple
//   it('should send registration SMS', function(done) {
//     Notify.sms.send('9920294797', 'register', {
//         lastName: 'Vader',
//       })
//       .then((result) => {
//         debug(result);
//         result = JSON.parse(result);
//         assert.equal(result.ErrorMessage, 'Done', 'ErrorMessage should be equal to Done');

//         done();
//       })
//       .catch((err) => {
//         throw err;
//       });
//   });

//   it('should send an email', function(done) {
//     const to = 'ralstan.vaz@gmail.com';
//     const cc = 'ralstan.vaz@hotmail.com';
//     const bcc = 'ralstan.vaz@nxtstack.com';
//     const subject = 'Auto generated test case';
//     const obj = {
//       firstName: 'Dart',
//       lastName: 'Vader',
//     };
//     const attachments = [{
//       filename: 'test.txt',
//       content: 'Just a test file',
//     }];

//     Notify.email.send(to, cc, bcc, subject, 'register', obj, attachments)
//       .then((result) => {
//         debug(result);
//         assert.equal(result.response, '250 Great success',
//           'response should be equal to 250 Great success');
//         done();
//       })
//       .catch((err) => {
//         throw err;
//       });
//   }).timeout(20000);
// });
