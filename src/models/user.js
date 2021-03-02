const config = require('../config/' + process.env.NODE_ENV + '.json');
let user;
if (config.db.db === 'mongo') {
  const mongoose = require('mongoose');

  const Schema = mongoose.Schema;

  /* Schema Definition */
  user = new Schema({
    active: {
      type: Boolean,
      default: true,
    },
    firstName: String,
    lastName: String,
    type: {
      type: String,
      lowercase: true,
      trim: true,
    },
    mobileNo: String,
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: String,
    image: String,
    otp: String,
    userId: {
      type: String,
      lowercase: true,
      trim: true,
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
    collection: 'user',
    versionKey: false,
  });

  user
    .pre('update', function(next) {
      this.update({}, {
        $set: {
          updatedAt: new Date(),
        },
      });
      next();
    });

  user.index({
    userId: 1,
  }, {
    unique: true,
  });
} else if (config.db.db === 'sql') {
  const Sequelize = require('sequelize');

  user = {
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    type: {
      type: Sequelize.STRING,
    },
    mobileNo: Sequelize.STRING,
    emailId: {
      type: Sequelize.STRING,
    },
    password: Sequelize.STRING,
    image: Sequelize.STRING,
    otp: Sequelize.STRING,
    userId: {
      type: Sequelize.STRING,
    },
    updatedAt: {
      type: Sequelize.DATE,
      default: Sequelize.NOW,
    },
    createdAt: {
      type: Sequelize.DATE,
      default: Sequelize.NOW,
    },
    // Add this so we can get the table name dynamically by the model
    tableName: {
      type: Sequelize.STRING,
      default: 'user',
    },
  };
}


module.exports.schema = user;
