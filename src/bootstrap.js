const config = require('./config/' + process.env.NODE_ENV || 'production');
const debug = require('debug')('projectname:bootstrap');
const user = require('./models/user.js');
const file = require('./models/file.js');

let User = require('./libs/user.js');
User = new User();

bootstrap = () => {
  debug('Adding the bootstrap data into data base');
  return new Promise((resolve, reject) => {
    syncModels()
      .then((result) => {
        resolve('Models Synced');
        return createIndexes();
      })
      .then((result) => {
        resolve('Indexes created');
        return createAdmin();
      })
      .then((result) => {
        resolve('Successfully Bootstrapped');
      })
      .catch((err) => {
        reject('Bootstrapping was unsuccessful');
      });
  });
};

function createAdmin() {
  return new Promise((resolve, reject) => {
    debug('User', User);
    User.getOne({
        userId: 'admin',
      })
      .then((result) => {
        resolve('Admin Already Exits');
      })
      .catch((err) => {
        if (err === config.errors.notFound) {
          return User.insert({
            firstName: 'admin',
            lastName: 'admin',
            type: 'admin',
            mobileNo: '9869469426',
            emailId: 'admin.v@nxtstack.com',
            password: '123456',
            image: 'name.jpg',
            otp: 'OTP',
            userId: 'admin',
          });
        }
        return err;
      })
      .then((result) => resolve('Admin Created'))
      .catch((err) => reject(err));
  });
}

function createIndexes() {
  // const userIndex = global.DB.ensureIndexes(user.schema);
  // const fileIndex = global.DB.ensureIndexes(file.schema);
  return new Promise((resolve, result) => {
    // Promise.all([userIndex, fileIndex])
    //   .then((result) => {
    //     debug('Index created', result);
    //     resolve(result);
    //   }).catch((err) => {
    //     debug('Index creation failed', err);
    //     reject(err);
    //   });
    resolve('cddsd');
  });
}

function syncModels() {
  return new Promise((resolve, result) => {
    if (config.db.db !== 'sql') {
      resolve('does not need syncing');
    }
    const userModel = global.DB.syncModels(user.schema, {
      alter: true,
    });
    const fileModel = global.DB.syncModels(file.schema, {
      alter: true,
    });

    Promise.all([userModel, fileModel])
      .then((result) => {
        debug('All models synced', result);
        resolve(result);
      }).catch((err) => {
        debug('Model syncing failed', err);
        reject(err);
      });
  });
}

module.exports = {
  bootstrap: bootstrap,
};
