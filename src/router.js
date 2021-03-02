let Router = require('express').Router;
Router = new Router();
const package = require('./package.json');
// Set all the headers here
Router.all('*', (req, res, next) => {
  res.header('Server', require('os').hostname());
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Expose-Headers', 'Query-Count');
  next();
});

/*
  Respond to all options request
*/
Router.options('*', (req, res) => {
  res.status(200).send({
    success: true,
  });
});

module.exports.router = (objApp) => {
  objApp.use('*', Router);

  // Index page
  objApp.use(`/${package.name}/`, require('./controllers/indexCtlr.js'));
  objApp.use(`/${package.name}/user`, require('./controllers/userCtlr.js'));
  objApp.use(`/${package.name}/report`, require('./controllers/reportCtlr.js'));
  objApp.use(`/${package.name}/file`, require('./controllers/fileCtlr.js'));
  objApp.use(`/${package.name}/token`, require('./controllers/tokenCtlr.js'));
  // objApp.use(`/${package.name}/attendance`, require('./modules/attendance'));
};
