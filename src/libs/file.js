const config = require('../config/' + process.env.NODE_ENV || 'production');
const debug = require('debug')('projectname:file');
const log = require('../handlers/logs.js');
const handlers = require('../handlers/handlers.js');
const file = require('../models/file.js');

class File {
  constructor() {}

  /**
   * @description Get files
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  get(query, project, options) {
    return new Promise((resolve, reject) => {
      global.DB.fetchAll(file.schema, query, project, options)
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
   * @description Get an file
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  getOne(query) {
    query = this.validate(query);
    query = this.format(query);

    return new Promise((resolve, reject) => {
      global.DB.fetchOne(file.schema, query, {}, {})
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
   * @description insert an file
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  insert(json, required = true) {
    json = this.validate(json);
    json = this.format(json);
    const validation = require('../validators/file.json');
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

      global.DB.insert(file.schema, json)
        .then((result) => {
          return result;
        })
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  };

  /**
   * @description Update files
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  update(query, json, required = false) {
    json = this.validate(json);
    json = this.format(json);

    const validation = require('../validators/file.json');
    return new Promise((resolve, reject) => {
      // const validate = validation;
      const error = handlers.validate(json, validation, required);

      if (error) {
        reject(error);
        return;
      }

      global.DB.updateQuery(file.schema, query, {
          $set: json,
        }, {})
        .then((result) => {
          return this.getOne(query);
        })
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  };

  /**
   * @description Delete an file
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  delete(query) {
    return global.DB.removeQuery(file.schema, query);
  };

  /**
   * @description Get file Count
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  count(query) {
    return global.DB.count(file.schema, query);
  };

  /**
   * @description Get aggregate files
   * @param  {object}
   * @param  {Function}
   * @return {object}
   */
  aggregate(query) {
    return new Promise((resolve, reject) => {
      global.DB.aggregate(file.schema, query)
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
      global.DB.distinct(file.schema, field, query)
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

  // Validate the in comming request
  validate(req) {
    if (false) {
      log.warn({
        source: source,
        route: '/',
      }, 'Validation Failed');
      return;
    }
    const file = req;
    return file;
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
    if (query.fileId) {
      query.fileId = query.fileId.toLowerCase();
    }

    return query;
  }
}
module.exports = File;
