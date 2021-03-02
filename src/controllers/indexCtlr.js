const errSource = 'indexCtlr';

const appDetails = require('../package.json');
const log = require('../handlers/logs.js');
let Router = require('express').Router;
Router = new Router();


// Home Page of the service. Ideally should return 'ok' for LB-health-check
Router.get('/', (req, res) => {
  res.status(200).send('ok');
});


Router.get('/version', (req, res) => {
  const methodName = 'version';

  log.enterErrorLog('4001', errSource, methodName,
    'Validation Error:', 'Validation Error:', 'i am an err');
  res.status(200).json({
    app: appDetails.name || 'undefined',
    version: appDetails.version || 'undefined',
  });
});

Router.post('/', (req, res) => {
  res.status(200).send(req.param('p') || 'oops');
});


module.exports = Router;
