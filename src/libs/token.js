const config = require('../config/' + process.env.NODE_ENV || 'production');
const debug = require('debug')('projectname:token');
const log = require('../handlers/logs.js');
const handlers = require('../handlers/handlers.js');
const rp = require('request-promise');
const mongoose = require('mongoose');

class Token {
  constructor() {}

  /**
   * @description Get tokens
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  uploadToken() {
    const url = config.cdn.url;
    const userId = config.cdn.userId;
    const password = config.cdn.password;

    const options = {
      method: 'POST',
      uri: url,
      body: {
        userId: userId,
        password: password,
      },
      json: true,
    };

    debug('CDN URL:', options);

    return rp(options);
  };

  /**
    Need to improve this
    Save the token and reuse the same
    Instead of requesting every time
   * @description access tokens
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  accessToken() {
    return new Promise((resolve, reject) => {
      const url = config.cdn.url;
      const accessUrl = config.cdn.accessUrl;
      const userId = config.cdn.userId;
      const password = config.cdn.password;
      const objId = new mongoose.Types.ObjectId();
      const token = objId.toString();
      const options = {
        method: 'POST',
        uri: url,
        body: {
          userId: userId,
          password: password,
        },
        json: true,
      };

      debug('CDN Login URL:', options);

      rp(options)
        .then((result) => {
          const options = {
            method: 'POST',
            uri: accessUrl,
            body: {
              token: token,
              fileName: 'tempfile', // Not used
            },
            headers: {
              'Authorization': `JWT ${result.token}`,
            },
            json: true,
          };

          debug('CDN Access URL:', options);

          return rp(options);
        })
        .then((result) => resolve({
          token: token,
        }))
        .catch((err) => reject(err));
    });
  };

  // Validate the in comming request
  validate(req) {
    if (false) {
      log.warn({
        source: source,
        route: '/',
      }, 'Validation Failed');
      return;
    }
    const token = req;
    return token;
  }

  format(query) {
    if (query.password) {
      query.password = handlers.hash(query.password);
    }
    if (query.type) {
      query.type = query.type.toLowerCase();
    }
    if (query.emailId) {
      query.emailId = query.emailId.toLowerCase();
    }
    if (query.tokenId) {
      query.tokenId = query.tokenId.toLowerCase();
    }

    return query;
  }
}
module.exports = Token;
