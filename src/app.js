const start = () => {
  return new Promise((resolve, reject) => {
    const debug = require('debug')('app');
    const info = require('debug')('info');
    const config = require('./config/' + process.env.NODE_ENV + '.json');
    const app = require('express')();
    const bodyParser = require('body-parser');
    const auth = require('./handlers/auth');
    const passport = require('passport');
    const db = require('./handlers/' + config.db.db + 'dbengine.js');
    const bootstrap = require('./bootstrap.js');
    const compression = require('compression');

    debug('environment: ' + process.env.NODE_ENV);
    debug('version: ' + process.env.VERSION);

    app.set('env', process.env.NODE_ENV);
    app.set('port', process.env.PORT);
    app.set('debug', process.env.DEBUG);
    app.set('version', process.env.VERSION);

    app.disable('x-powered-by');
    app.disable('etag');
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(compression());
    // setup passport auth - before routes, after express session
    passport.use(auth.jwtStrategy);


    app.use(bodyParser.urlencoded({
      extended: false,
    }));

    require('./router.js').router(app);
    // require('./services/exampleService.js');

    // / catch 404 and forward to error handler
    app.use((req, res, next) => {
      const error = new Error('Are you lost?');
      error.status = 404;
      next(error);
    });

    if (app.get('env') === 'development') {
      app.use((error, req, res, next) => {
        debug('http_status: %d, %s', error.status || 500, error.message);
        next(error);
      });
    }

    app.use((error, req, res, next) => {
      res.status(error.status || 500).send({
        title: 'error',
        error: error,
        message: error.message,
        trace: error.stack,
      });
    });

    // Connect the database
    db.connect(config.db[config.db.db])
      .then((connection) => {
        info('Database connected');
        global.DB = connection;
        return bootstrap.bootstrap();
      })
      .then((result) => {
        info(result);
        const server = app.listen(app.get('port'), () => {
          debug('Express server listening on port ' + server.address().port);
          resolve('successfully started');
        });
      })
      .catch((err) => {
        info('Error when connecting to the database ', err);
        reject(err);
      });

    process.on('exit', (code) => {
      debug('Cleaning up ...');
      require('./cleanup')(app);
      debug('Exiting !!!');
    });

    process.on('uncaughtException', (error) => {
      debug('error(unhandled): ' + error);
      info({
        title: 'error',
        error: error,
        message: error.message,
        trace: error.stack,
      });
      process.exit(1);
    });

    process.on('SIGINT', () => {
      debug('gotta exit - SIGINT');
      process.exit(0);
    });
    // }
  });
};

const stop = () => {
  process.exit(0);
};

module.exports = {
  start: start,
  stop: stop,
};
