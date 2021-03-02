const Sequelize = require('sequelize');
const debug = require('debug')('sequelize');
let db;
let conObj;

function connect(obj) {
  return new Promise((resolve, reject) => {
    db = new Sequelize(obj.database, obj.username, obj.password, {
      host: obj.host,
      dialect: obj.dialect,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },

      // SQLite only
      storage: 'path/to/database.sqlite',

      // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
      operatorsAliases: false,
    });


    db.authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');


        // db.once('open', function(ok) {
        function insert(schema, json) {
          const table = schema.tableName.default;
          const objmodel = db.define(table, schema);

          debug('schema: ' + schema + ' json: ' + JSON.stringify(json));

          // Return a promise
          return objmodel.create(json);
        }

        // function update(schema, json) {
        //   const objmodel = db.model(schema.options.collection, schema);

        //   debug('schema: ' + schema.options.collection + ' json: ' + JSON.stringify(json));

        //   id = json._id;
        //   delete json._id;

        //   // Return a promise
        //   return objmodel.update({
        //     _id: id,
        //   }, json, {
        //     upsert: false,
        //   });
        // }

        function updateQuery(schema, query, json, options) {
          const table = schema.tableName.default;
          const objmodel = db.define(table, schema);

          debug('schema: ' + schema + ' json: ' +
            JSON.stringify(json) + ' query: ' + JSON.stringify(query));

          return objmodel.update(json, {
            where: query,
          });
        }

        function fetchOne(schema, query) {
          const table = schema.tableName.default;

          const objmodel = db.define(table, schema);

          debug('schema: ' + schema + ' query: ' + JSON.stringify(query));

          return objmodel.findOne({
            where: query,
          });
        }

        function fetchAll(schema, query, fields, options) {
          const table = schema.tableName.default;
          const objmodel = db.define(table, schema);

          debug('schema: ' + schema + ' query: ' + JSON.stringify(query));

          return objmodel.findAll({
            where: query,
          });
        }

        // function remove(schema, json) {
        //   const objmodel = db.model(schema.options.collection, schema);

        //   debug('schema: ' + schema.options.collection + ' json: ' + JSON.stringify(json));

        //   return objmodel.remove({
        //     _id: json._id,
        //   });
        // }

        function removeQuery(schema, query) {
          const table = schema.tableName.default;
          const objmodel = db.define(table, schema);

          debug('schema: ' + schema + ' query: ' + JSON.stringify(query));

          return objmodel.destroy({
            where: query,
          });
        }
        // function fetchOneAndUpdate(schema, query, update, options) {
        //   const objmodel = db.model(schema.options.collection, schema);

        //   debug('schema: ' + schema.options.collection + ' query: ' +
        //     JSON.stringify(query) + ' Update: ' + JSON.stringify(update) +
        //     ' Options: ' + JSON.stringify(options));

        //   return objmodel.findOneAndUpdate(query, update, options);
        // }

        // function mapReduce(schema, options) {
        //   const objmodel = db.model(schema.options.collection, schema);
        //   return objmodel.mapReduce(options);
        // }

        // function aggregate(schema, query) {
        //   const objmodel = db.model(schema.options.collection, schema);

        //   debug('schema: ' + schema.options.collection + ' query: ' + JSON.stringify(query));

        //   return objmodel.aggregate(query);
        // }

        function count(schema, query) {
          const table = schema.tableName.default;
          const objmodel = db.define(table, schema);

          debug('schema: ' + schema + ' query: ' + JSON.stringify(query));

          return objmodel.count({
            where: query,
          });
        }
        // function distinct(schema, field, query) {
        //   const objmodel = db.model(schema.options.collection, schema);

        //   debug('schema: ' + schema.options.collection + ' json: ' + JSON.stringify(query));

        //   return objmodel.distinct(field, query);
        // }

        // function ensureIndexes(schema) {
        //   const objmodel = db.model(schema.options.collection, schema);

        //   debug('schema: ' + schema.options.collection + ' ensureIndexes');

        //   return objmodel.ensureIndexes();
        // }

        function syncModels(schema, json) {
          const table = schema.tableName.default;
          const objmodel = db.define(table, schema);

          debug('schema: ' + schema + ' json: ' + JSON.stringify(json));

          // Return a promise
          return objmodel.sync(json);
        }

        function getConnection() {
          return db;
        }

        conObj = {
          connect: connect,
          insert: insert,
          // remove: remove,
          // update: update,
          fetchOne: fetchOne,
          fetchAll: fetchAll,
          // fetchOneAndUpdate: fetchOneAndUpdate,
          // mapReduce: mapReduce,
          // mongoose: mongoose,
          removeQuery: removeQuery,
          // aggregate: aggregate,
          updateQuery: updateQuery,
          count: count,
          // distinct: distinct,
          getConnection: getConnection,
          // ensureIndexes: ensureIndexes,
          syncModels: syncModels,
        };

        resolve(conObj);
        // });
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
        reject(err);
      });
  });
}

module.exports = {
  connect: connect,
};
