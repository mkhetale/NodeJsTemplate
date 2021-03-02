const count = require('../models/count.js');

class Count {
  constructor() {}

  inc(name) {
    const incObj = {};
    incObj[name] = 1;
    return global.DB.fetchOneAndUpdate(count.schema, {}, {
      $inc: incObj,
    }, {
      new: true,
      upsert: true,
    });
  }
}

module.exports = Count;
