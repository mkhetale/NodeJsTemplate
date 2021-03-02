const config = require('../config/' + process.env.NODE_ENV || 'production');
const package = require('../package.json');
const debug = require('debug')(`${package.name}:user`);
const log = require('../handlers/logs.js');
const handlers = require('../handlers/handlers.js');
const user = require('../models/user.js');


class User {
  constructor() {}

  /**
   * @description Get users
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  get(query, project, options) {
    return new Promise((resolve, reject) => {
      global.DB.fetchAll(user.schema, query, project, options)
        .then((result) => {
          if (result === null || result.length === 0) {
            reject(config.errors.notFound);
            return;
          }
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  };

  /**
   * @description Get an user
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  getOne(query) {
    query = this.validate(query);
    query = this.format(query);

    return new Promise((resolve, reject) => {
      global.DB.fetchOne(user.schema, query, {}, {})
        .then((result) => {
          if (result === null || result.length === 0) {
            reject(config.errors.notFound);
            return;
          }
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  };


  /**
   * @description insert an user
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  insert(json, required = true) {
    json = this.validate(json);
    json = this.format(json);
    const validation = require('../validators/user.json');
    return new Promise((resolve, reject) => {
      // debug('json validation', json)
      // debug('json validation', validation)
      // debug('required', required)
      debug('Inside The Insert');

      const error = handlers.validate(json, validation, required);
      debug('error validation', error);
      if (error) {
        reject(error);
        return;
      }
      global.DB.insert(user.schema, json)
        .then((result) => {
          return result;
        })
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  };

  /**
   * @description Update users
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  update(query, json, required = false) {
    json = this.validate(json);
    json = this.format(json);

    const validation = require('../validators/user.json');
    return new Promise((resolve, reject) => {
      const error = handlers.validate(json, validation, required);

      if (error) {
        reject(error);
        return;
      }

      global.DB.updateQuery(user.schema, query, json, {})
        .then((result) => {
          return this.getOne(query);
        })
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  };

  /**
   * @description Delete an user
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  delete(query) {
    return global.DB.removeQuery(user.schema, query);
  };

  /**
   * @description Get user Count
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  count(query) {
    return global.DB.count(user.schema, query);
  };

  /**
   * @description Get aggregate users
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  aggregate(query) {
    return new Promise((resolve, reject) => {
      global.DB.aggregate(user.schema, query)
        .then((result) => {
          if (result === null || result.length === 0) {
            reject(config.errors.notFound);
            return;
          }
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  };

  /**
   * @description Get distinct
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  distinct(field, query) {
    return new Promise((resolve, reject) => {
      global.DB.distinct(user.schema, field, query)
        .then((result) => {
          if (result === null || result.length === 0) {
            reject(config.errors.notFound);
            return;
          }
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  };


  /**
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  // sendOTP(mobileNo) {

  //   const query = {
  //     mobileNo: mobileNo
  //   }

  //   return new Promise((resolve, reject) => {
  //     this.getOne(query)
  //       .then(result => {
  //         return Cs.otp(mobileNo, 'projectname')
  //       })
  //       .then(result => resolve(result))
  //       .catch(err => reject(err))
  //   })
  // };

  // Validate the in comming request
  validate(req) {
    if (false) {
      log.warn({
        source: source,
        route: '/',
      }, 'Validation Failed');
      return;
    }
    const user = req;
    return user;
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
    if (query.userId) {
      query.userId = query.userId.toLowerCase();
    }

    return query;
  }
}
module.exports = User;
