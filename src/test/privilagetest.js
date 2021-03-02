if (!global.Promise) {
  global.Promise = Promise;
}

process.env.DEBUG = process.env.DEBUG || 'info,app';

const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const debug = require('debug')('projectname:privilage:test');
const assert = require('chai').assert;
const handlers = require('../handlers/handlers.js');

const userUrl = 'http://127.0.0.1:6633/projectname';

let token = '';
chai.use(chaiHttp);

chai.use(chaiHttp);
describe('admin', function() {
  it('should login an Admin', function() {
    return chai.request(userUrl)
      .post('/user/login')
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

  it('should insert a user', function() {
    let obj = {
      active: true,
      firstName: 'rohil',
      lastName: 'Vaz',
      type: 'user',
      mobileNo: '9869469426',
      emailId: 'rohil.v@nxtstack.com',
      password: 'user',
      image: 'name.jpg',
      otp: 'OTP',
      userId: 'rohil',
    };
    return chai.request(userUrl)
      .post('/user/')
      .send(obj)
      .set('Authorization', token)
      .then(function(res) {
        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);
        // The response will always be an object
        expect(res.body).to.be.an('object');
        obj = handlers.format(obj);
        compObj = handlers.jsoncomparer(obj, res.body);
        assert.deepEqual(obj, compObj);
      })
      .catch(function(err) {
        debug('from insert', err);
        throw err;
      });
  });

  it('Should  be allowed to get user details of user/rohil', function() {
    return chai.request(userUrl)
      .get('/user/rohil')
      .set('Authorization', token)
      .then(function(res) {
        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);
        // The response will always be an object
        expect(res.body).to.be.an('object');
      })
      .catch(function(err) {
        throw err;
      });
  });

  it('should login a User', function() {
    return chai.request(userUrl)
      .post('/user/login')
      .send({
        userId: 'rohil',
        password: 'user',
      })
      .then(function(res) {
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

  it('should not insert a user', function() {
    const obj = {
      active: true,
      firstName: 'Beatus',
      lastName: 'Fernandes',
      type: 'user',
      mobileNo: '9869469426',
      emailId: 'rohil.v@nxtstack.com',
      password: 'user',
      images: 'name.jpg',
      otp: 'OTP',
      userId: 'beathis',
    };
    return chai.request(userUrl)
      .post('/user/')
      .send(obj)
      .set('Authorization', token)
      .then(function(res) {
        throw res;
      })
      .catch(function(err) {
        // Status should always be 200 if the login succeeds
        expect(err.response).to.have.status(401);
        // The response will always be an object
        expect(err.response.text).to.be.an('string');
        // The success status must be false if the login fails
        expect(err.response.text).to.be.equal('Unauthorized');
      });
  });

  it('Should not be allowed to get user details admin', function() {
    return chai.request(userUrl)
      .get('/user/admin')
      .set('Authorization', token)
      .then(function(res) {
        throw err;
      })
      .catch(function(err) {
        debug('Login response', err.response);
        // Status should always be 200 if the login succeeds
        expect(err.response).to.have.status(401);
        // The response will always be an object
        expect(err.response.text).to.be.an('string');
        // The success status must be false if the login fails
        expect(err.response.text).to.be.equal('Unauthorized');
      });
  });

  it('should not allow to update an admin', function() {
    const obj = {
      active: true,
      emailId: 'admin.admin@gmail.com',
    };
    return chai.request(userUrl)
      .put('/user/admin')
      .send(obj)
      .set('Authorization', token)
      .then(function(res) {
        throw res;
      })
      .catch(function(err) {
        // Status should always be 200 if the login succeeds
        expect(err.response).to.have.status(401);
        // The response will always be an object
        expect(err.response.text).to.be.an('string');
        // The success status must be false if the login fails
        expect(err.response.text).to.be.equal('Unauthorized');
      });
  });

  it('should not delete an admin', function() {
    return chai.request(userUrl)
      .delete('/user/admin')
      .set('Authorization', token)
      .then(function(res) {
        throw res;
      })
      .catch(function(err) {
        // Status should always be 200 if the login succeeds
        expect(err.response).to.have.status(401);
        // The response will always be an object
        expect(err.response.text).to.be.an('string');
        // The success status must be false if the login fails
        expect(err.response.text).to.be.equal('Unauthorized');
      });
  });

  it('Should  be allowed to get user details of rohil', function() {
    return chai.request(userUrl)
      .get('/user/rohil')
      .set('Authorization', token)
      .then(function(res) {
        debug('Login response', res.body);
        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);
        // The response will always be an object
        expect(res.body).to.be.an('object');
      })
      .catch(function(err) {
        throw err;
      });
  });

  it('should login an Admin', function() {
    return chai.request(userUrl)
      .post('/user/login')
      .send({
        userId: 'admin',
        password: '123456',
      })
      .then(function(res) {
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

  it('should delete a user', function() {
    return chai.request(userUrl)
      .delete('/user/rohil')
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
});
