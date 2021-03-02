if (!global.Promise) {
  global.Promise = Promise;
}

process.env.DEBUG = process.env.DEBUG || 'info,app';

const expect = require('chai').expect;
const assert = require('chai').assert;
const chai = require('chai');
const chaiHttp = require('chai-http');
const debug = require('debug')('projectname:user:test');
const handlers = require('../handlers/handlers.js');
const url = 'http://127.0.0.1:6633/projectname/user';

let token = '';
let id = '';

chai.use(chaiHttp);

describe('user', function() {
  it('should login a user', function() {
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

  it('should fail the login', function() {
    return chai.request(url)
      .post('/login')
      .send({
        userId: 'ralstan.vaz',
        password: '123',
      })
      .then(function(res) {
        throw res;
      })
      .catch(function(err) {
        debug('Login response', err.response.text);
        // Status should always be 401 if the login fails(unauthorised)
        expect(err).to.have.status(401);
        // The response will always be an object
        expect(JSON.parse(err.response.text)).to.be.an('object');
        // The success status must be false if the login fails
        expect(JSON.parse(err.response.text).error).to.be.equal('Authentication failed');
      });
  });

  it('should insert a user with wrong details', function() {
    const obj = {
      active: true,
      firstName: 'Ralstan Vaz',
      lastName: 'Vaz',
      type: 'admin',
      mobileNo: '99asdde4798',
      emailId: 'ralstan.vaz$stack.com',
      password: '123456',
      image: 'name.jpg',
      otp: 'OTP',
      userId: 'ralstan93vaz',
    };

    return chai.request(url)
      .post('/')
      .send(obj)
      .set('Authorization', token)
      .then(function(res) {
        throw res;
      })
      .catch(function(err) {
        expect(err).to.have.status(400);
        debug(err.response.body);
        // The response will always be an object
        expect(err.response.body).to.be.an('object');
      });
  });

  it('should insert a user', function() {
    let obj = {
      active: true,
      firstName: 'Ralstan Vaz',
      lastName: 'Vaz',
      type: 'admin',
      mobileNo: '9920294798',
      emailId: 'ralstan.vaz@nxtstack.com',
      password: '123456',
      image: 'name.jpg',
      otp: 'OTP',
      userId: 'ralstan93vaz',
    };
    return chai.request(url)
      .post('/')
      .send(obj)
      .set('Authorization', token)
      .then(function(res) {
        debug('insert response', res.body);
        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);
        // The response will always be an object
        expect(res.body).to.be.an('object');
        obj = handlers.format(obj);
        compObj = handlers.jsoncomparer(obj, res.body);
        debug('response body from insert', compObj);
        debug('response body from object', obj);
        assert.deepEqual(obj, compObj);
        id = res.body.userId;
      })
      .catch(function(err) {
        debug(err);
        throw err;
      });
  });

  it('should update a user', function() {
    let obj = {
      active: true,
      emailId: 'ralstan.vaz@gmail.com',
    };
    return chai.request(url)
      .put(`/${id}`)
      .send(obj)
      .set('Authorization', token)
      .then(function(res) {
        debug('update response', res.body);

        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);

        // The response will always be an object
        expect(res.body).to.be.an('object');

        obj = handlers.format(obj);
        compObj = handlers.jsoncomparer(obj, res.body);
        debug('response body from insert', compObj);
        debug('response body from object', obj);

        assert.deepEqual(obj, compObj);
      })
      .catch(function(err) {
        throw err;
      });
  });

  it('should list a user', function() {
    return chai.request(url)
      .get(`/${id}`)
      .set('Authorization', token)
      .then(function(res) {
        debug('List response', res.body);

        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);

        // The response will always be an object
        expect(res.body).to.be.an('object');
      })
      .catch(function(err) {
        throw err;
      });
  });

  it('should list all users', function() {
    return chai.request(url)
      .get('/')
      .set('Authorization', token)
      .then(function(res) {
        debug('List All response', res.body);

        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);

        // The response will always be an object
        expect(res.body).to.be.an('array');
      })
      .catch(function(err) {
        throw err;
      });
  });


  it('should delete a user', function() {
    return chai.request(url)
      .delete(`/${id}`)
      .set('Authorization', token)
      .then(function(res) {
        debug('delete response', res.body);

        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);

        // The response will always be an object
        expect(res.body).to.be.an('object');

        // If successful must always be true
        expect(res.body.success).to.be.true;
      })
      .catch(function(err) {
        debug(err);
        throw err;
      });
  });

  it('Should reject when invalid token is used', function() {
    return chai.request(url)
      .post('/')
      .set('Authorization', 'token')
      .then(function(res) {
        throw res;
      })
      .catch(function(err) {
        debug('Invalid token response', err.response.text);

        // Status should always be 401 if the login fails(unauthorised)
        expect(err).to.have.status(401);

        // The response will always be an object
        expect(err.response.text).to.be.an('string');

        // The success status must be false if the login fails
        expect(err.response.text).to.be.equal('Unauthorized');
      });
  });
});
