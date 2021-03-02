const expect = require('chai').expect;
const assert = require('chai').assert;
// const package = require('../package.json');
// const projectName = package.name;
if (!global.Promise) {
  global.Promise = Promise;
}

const chai = require('chai');
const chaiHttp = require('chai-http');
const debug = require('debug')('nbhc-api:attendance:test');
const handlers = require('../handlers/handlers.js');
const url = 'http://127.0.0.1:6633/${projectName}/attendance';
const urlUser = 'http://127.0.0.1:6633/${projectName}/user/login';
// const moment = 'moment';
let token = '';
let _id;
chai.use(chaiHttp);

describe('attendance', function() {
  it('should login a attendance', function() {
    return chai.request(urlUser)
      .post('/')
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


  it('should insert a attendance with wrong details', function() {
    const obj = {
      absent: 'true',
      userId: 'AAA AAAA',
      date: '2015-03-10T20:30:00.000Z',
    };

    return chai.request(url)
      .post('/')
      .send(obj)
      .set('Authorization', token)
      .then(function(res) {
        debug(res);
        throw res;
      })
      .catch(function(err) {
        expect(err).to.have.status(404);
        debug(err.response.body);

        // The response will always be an object
        expect(err.response.body).to.be.an('object');
      });
  });

  it('should insert a attendance', function() {
    let obj = {
      absent: true,
      comment: 'not well',
      date: '2015-03-10T20:30:00.000Z',
      userId: 'admin',
    };
    return chai.request(url)
      .post('/')
      .send(obj)
      .set('Authorization', token)
      .then(function(res) {
        debug('insert response', res.body);

        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);
        _id = res.body._id;
        debug('=============== debug ===================', _id);
        // The response will always be an object
        expect(res.body).to.be.an('object');
        obj = handlers.format(obj);
        compObj = handlers.jsoncomparer(obj, res.body);

        assert.deepEqual(obj, compObj);

        /*        if (!compObj.status) {
                  console.log(compObj.text);
                }

                // Check if the fields match
                expect(compObj.status).to.be.true;*/
      })

      .catch(function(err) {
        throw err;
      });
  });


  it('should not insert a attendance with coincident date', function() {
    const obj = {
      absent: false,
      comment: 'not well',
      date: '2015-03-10T20:30:00.000Z',
      userId: 'admin',
    };
    return chai.request(url)
      .post('/')
      .send(obj)
      .set('Authorization', token)
      .then(function(res) {
        throw res;
      })
      .catch(function(err) {
        debug(err.response.body.description);
        expect(err).to.have.status(400);
        assert.equal(err.response.body.description, 'User Already Added For This Date');
      });
  });


  it('should update a attendance', function() {
    const obj = {
      userId: 'admin',
      date: '2013-03-10T20:30:00.000Z',
    };
    return chai.request(url)
      .put(`/${_id}`)
      .send(obj)
      .set('Authorization', token)
      .then(function(res) {
        debug('update response', res.body);

        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);

        // The response will always be an object
        expect(res.body).to.be.an('object');

        // obj = handlers.format(obj);
        // compObj = handlers.jsoncomparer(obj, res.body);
        // debug(res.body);
        // debug('response body from insert', compObj);
        // debug('response body from object', obj);

        // assert.deepEqual(obj, compObj);
      })
      .catch(function(err) {
        debug('update error', err);
        throw err;
      });
  });

  it('should list a attendance', function() {
    return chai.request(url)
      .get(`/${_id }`)
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

  it('should list all attendances', function() {
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

  it('should delete a attendance', function() {
    return chai.request(url)
      .delete(`/${_id}`)
      .set('Authorization', token)
      .then(function(res) {
        debug('delete response', res.body);

        // Status should always be 200 if the login succeeds
        expect(res).to.have.status(200);

        // The response will always be an object
        // expect(res.body).to.be.an('object');
        // If successful must always be true
        expect(res.body.success).to.be.true;
      })
      .catch(function(err) {
        debug(err);
        throw err;
      });
  });
});
