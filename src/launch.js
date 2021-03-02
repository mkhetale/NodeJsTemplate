process.env.NODE_ENV = process.env.NODE_ENV || 'production';

process.env.PORT = process.env.PORT || 80;
process.env.VERSION = require('./package.json').version || 'undefined';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
  const debug = 'app,express:router,express:application,info,projectname:*,mongodb,gulp';
  process.env.DEBUG = process.env.DEBUG || debug;
}

process.env.DEBUG = process.env.DEBUG || 'info,app';

const app = require('./app.js');
const info = require('debug')('info');
const cluster = require('cluster');
// In most cases we will just be running a single instance
// const numCPUs = require('os').cpus().length;


// Check if the master process is running
if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < 1; i++) {
    cluster.fork();
    info('Cluster forked ' + i);
  }

  cluster.on('exit', (worker, code, signal) => {
    info('worker ' + worker.process.pid + ' died with code: ' + code + ' signal: ' + signal);

    // fork an new process if app crashes
    if (code !== 0) {
      cluster.fork();
      info('New process folked');
    }
  });

  cluster.on('online', (worker) => {
    info('A worker with #' + worker.id + ' has started');
  });

  cluster.on('listening', (worker, address) => {
    info('A worker is now connected to ' + address.address + ':' + address.port);
  });
}

if (cluster.isWorker) {
  app.start()
    .then((result) => {
      info(result);
    })
    .catch((err) => {
      info(err);
      process.exit(1);
    });
}
