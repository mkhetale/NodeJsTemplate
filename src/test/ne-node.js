// const assert = require('chai').assert;
// const debug = require('debug')('projectname:ne-node:test');
// let NE = require('../ne-node');
// NE = new NE();

// describe('Notification Engine', function() {
//   // User commer seperate numbers to send to multiple
//   it('should send SMS', function(done) {
//     NE.sms.send({
//         number: '9920294797,9869469426',
//         text: 'Test from test case',
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

//   it('should reject when mobile no is not valid', function(done) {
//     NE.sms.send({
//         number: '992029479',
//         text: 'Test from test case',
//       })
//       .then((result) => {
//         debug(result);
//         result = JSON.parse(result);
//         assert.equal(result.ErrorMessage, 'mobile numbers not valid',
//           'ErrorMessage should be equal to mobile numbers not valid');

//         done();
//       })
//       .catch((err) => {
//         throw err;
//       });
//   });

//   it('should send an email', function(done) {
//     const from = 'hello@nxtstack.com';
//     const to = 'ralstan.vaz@gmail.com';
//     const cc = 'ralstan.vaz@hotmail.com';
//     const bcc = 'ralstan.vaz@nxtstack.com';
//     const subject = 'Auto generated test case';
//     const body = 'Obvious it works I have written it';
//     const attachments = [{
//       filename: 'test.txt',
//       content: 'Just a test file',
//     }];
//     const replyTo = 'hello@nxtstack.com';

//     NE.email.send(from, to, cc, bcc, subject, body, attachments, replyTo)
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
