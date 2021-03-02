const couchDB = require('couchbase');

const DbConnection = (config) => {
  const cluster = new couchDB.Cluster(config.cluster);

  const bucket = cluster.openBucket(config.bucket, config.password, (err) => {
    if (err)
      throw err;
  });

  const insert = (key, value, options, cb) => {
    bucket.insert(key, {
      url: value,
    }, options, (err, result) => {
      if (err)
        return cb(err);

      return cb(null, true);
    });
  };

  const exists = (key, cb) => {
    bucket.get(key, (err, result) => {
      if (err && err.code !== 13) {
        return cb(err);
      }

      if (result !== null)
        return cb(null, true);

      return cb(null, false);
    });
  };

  const get = (key, cb) => {
    bucket.get(key, (err, result) => {
      if (err)
        return cb(err);

      return cb(null, result.value);
    });
  };

  const disconnect = () => {
    return bucket.disconnect();
  };


  return {
    insert: insert,
    exists: exists,
    get: get,
    disconnect: disconnect,
  };
};

module.exports = DbConnection;
