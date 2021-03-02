process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const info = require('debug')('info');

process.env.DEBUG = process.env.DEBUG || 'info,app';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
  const debug = 'app,express:router,express:application,info,projectname:*,mongodb';
  process.env.DEBUG = process.env.DEBUG || debug;
}

if (process.env.NODE_ENV === 'testing') {
  const debug = 'app,express:router,express:application,info,projectname:*,mongodb';
  process.env.DEBUG = process.env.DEBUG || debug;

  info('Running cron for job');
  process.exit(0);
}


let Notify = require('../notify');
const package = require('../package.json');
const debug = require('debug')(`${package.name}:job`);
Notify = new Notify();

setTimeout(function(argument) {
  job();
}, 2000);

// The logic for jobs should be in reports or in any other lib
function job() {
  const to = 'ralstan.vaz@gmail.com';
  const cc = 'ralstan.vaz@hotmail.com';
  const bcc = 'ralstan.vaz@nxtstack.com';
  const subject = 'Email for job';
  const obj = {
    text: 'some csv data',
  };
  const attachments = [{
    filename: 'job.txt',
    content: 'Just a job',
  }];

  Notify.email.send(to, cc, bcc, subject, 'text', obj, attachments)
    .then((result) => {
      debug(result);
    })
    .catch((err) => {
      throw err;
    });
}
