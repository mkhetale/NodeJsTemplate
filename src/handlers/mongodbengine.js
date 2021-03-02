const mongoose = require('mongoose');
const debug = require('debug')('mongodb');
let db;
let conObj;

mongoose.Promise = Promise;

function connect(url) {
  // if (db) {
  //   if (db._readyState === 1 || 2) {
  //     console.log('db._readyState', db._readyState);
  //     callbackvalue(null, conObj);
  //     return;
  //   }
  // }
  return new Promise((resolve, reject) => {
    db = mongoose.createConnection(url, {
      server: {
        auto_reconnect: true,
      },
    });

    // db.on('error', console.error.bind(console, 'connection error:'));
    // db.on('error', callbackvalue);
    db.on('error', function(err) {
      debug('Reconnecting from error');
      reject(err);
      db = mongoose.createConnection(url, {
        server: {
          auto_reconnect: true,
        },
      });
    });

    db.on('close', function(err, res) {
      debug('Reconnecting from close');
      db = mongoose.createConnection(url, {
        server: {
          auto_reconnect: true,
        },
      });
    });

    db.once('open', function(ok) {
      function insert(schema, json) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' json: ' + JSON.stringify(json));

        // Return a promise
        return objmodel.create(json);
      }

      function update(schema, json) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' json: ' + JSON.stringify(json));

        id = json._id;
        delete json._id;

        // Return a promise
        return objmodel.update({
          _id: id,
        }, json, {
          upsert: false,
        });
      }

      function updateQuery(schema, query, json, options) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' json: ' +
          JSON.stringify(json) + ' query: ' + JSON.stringify(query));

        return objmodel.update(query, {
          $set: json,
        }, options);
      }

      function fetchOne(schema, query) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' query: ' + JSON.stringify(query));

        return objmodel.findOne(query);
      }

      function fetchAll(schema, query, fields, options) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' query: ' + JSON.stringify(query));

        return objmodel.find(query, fields, options);
      }

      function remove(schema, json) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' json: ' + JSON.stringify(json));

        return objmodel.remove({
          _id: json._id,
        });
      }

      function removeQuery(schema, query) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' json: ' + JSON.stringify(query));

        return objmodel.remove(query);
      }

      function fetchOneAndUpdate(schema, query, update, options) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' query: ' +
          JSON.stringify(query) + ' Update: ' + JSON.stringify(update) +
          ' Options: ' + JSON.stringify(options));

        return objmodel.findOneAndUpdate(query, update, options);
      }

      function mapReduce(schema, options) {
        const objmodel = db.model(schema.options.collection, schema);
        return objmodel.mapReduce(options);
      }

      function aggregate(schema, query) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' query: ' + JSON.stringify(query));

        return objmodel.aggregate(query);
      }

      function count(schema, query) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' json: ' + JSON.stringify(query));

        return objmodel.count(query);
      }

      function distinct(schema, field, query) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' json: ' + JSON.stringify(query));

        return objmodel.distinct(field, query);
      }

      function ensureIndexes(schema) {
        const objmodel = db.model(schema.options.collection, schema);

        debug('schema: ' + schema.options.collection + ' ensureIndexes');

        return objmodel.ensureIndexes();
      }

      function getConnection() {
        return db;
      }

      conObj = {
        connect: connect,
        insert: insert,
        remove: remove,
        update: update,
        fetchOne: fetchOne,
        fetchAll: fetchAll,
        fetchOneAndUpdate: fetchOneAndUpdate,
        mapReduce: mapReduce,
        mongoose: mongoose,
        removeQuery: removeQuery,
        aggregate: aggregate,
        updateQuery: updateQuery,
        count: count,
        distinct: distinct,
        getConnection: getConnection,
        ensureIndexes: ensureIndexes,
      };

      resolve(conObj);
    });
  });
}

module.exports = {
  connect: connect,
};
