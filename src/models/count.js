const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/* Schema Definition */
const count = new Schema({
  active: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'count',
  versionKey: false,
});

count
  .pre('update', function(next) {
    this.update({}, {
      $set: {
        updatedAt: new Date(),
      },
    });
    next();
  });

module.exports.schema = count;
