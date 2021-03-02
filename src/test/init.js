if (!global.Promise) {
  global.Promise = Promise;
}

const app = require('../app.js');
const info = require('debug')('info');

before((done) => {
  app.start()
    .then((result) => {
      info(result);
      done();
    })
    .catch((err) => {
      info(err);
      done(err);
      process.exit(1);
    });
});

after(function() {
  app.stop();
});
