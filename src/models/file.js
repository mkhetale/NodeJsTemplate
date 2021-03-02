const config = require('../config/' + process.env.NODE_ENV + '.json');
let file;
if (config.db.db === 'mongo') {
  const mongoose = require('mongoose');

  const Schema = mongoose.Schema;

  /* Schema Definition */
  file = new Schema({
    active: {
      type: Boolean,
      default: true,
    },
    parentId: String,
    type: {
      type: String,
      lowercase: true,
      trim: true,
    },
    name: String,
    path: String,
    tags: String,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }, {
    collection: 'file',
    versionKey: false,
  });

  file
    .pre('update', function(next) {
      this.update({}, {
        $set: {
          updatedAt: new Date(),
        },
      });
      next();
    });
} else if (config.db.db === 'sql') {
  const Sequelize = require('sequelize');
  file = {
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    parentId: Sequelize.STRING,
    type: {
      type: Sequelize.STRING,
    },
    name: Sequelize.STRING,
    path: Sequelize.STRING,
    tags: Sequelize.STRING,
    updatedAt: {
      type: Sequelize.DATE,
      default: Sequelize.NOW,
    },
    createdAt: {
      type: Sequelize.DATE,
      default: Sequelize.NOW,
    },
    tableName: {
      type: Sequelize.STRING,
      default: 'file',
    },
  };
}

module.exports.schema = file;
