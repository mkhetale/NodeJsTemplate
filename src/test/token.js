if (!global.Promise) {
  global.Promise = Promise;
}

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const debug = require('debug')('projectname:token:test');
const url = 'http://127.0.0.1:6633/projectname/token';
let token = '';

chai.use(chaiHttp);

describe('Token', function() {
  it('should login an Admin', function() {
    return chai.request(url)
    .post('/login')
      .send({
        userId: 'admin',
        password: '123456',
      })
      .then(function(res) {
        debug('Login response', res.body);
        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);
        // The response will always be an object
        expect(res.body).to.be.an('object');
        // The success status must be true if the login succeeds
        expect(res.body.success).to.be.true;

        token = `JWT ${res.body.token}`;
      })
      .catch(function(err) {
        throw err;
      });
  });

  it('should get cdn upload token', function() {
    return chai.request(url)
      .get('/cdn/uploadtoken')
      .set('Authorization', token)
      .then(function(res) {
        debug('List All response', res.body);

        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);

        // The response will always be an object
        expect(res.body).to.be.an('object');

        expect(res.body.success).to.be.equal(true);
      })
      .catch(function(err) {
        throw err;
      });
  });

  // Add Object Id test case
  it('should get cdn access token', function() {
    return chai.request(url)
      .get('/cdn/accesstoken')
      .set('Authorization', token)
      .then(function(res) {
        debug('List All response', res.body);

        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);

        // The response will always be an object
        expect(res.body).to.be.an('object');
      })
      .catch(function(err) {
        throw err;
      });
  });
});
