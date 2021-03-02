const auth = require('../handlers/auth');
let Report = require('../libs/report.js');
const package = require('../package.json');
const debug = require('debug')(`${package.name}:reportCtlr`);
const userSchema = require('../models/user.js');
let Router = require('express').Router;
Router = new Router();
Report = new Report();


Router.all('*', auth.authMiddleware, (req, res, next) => {
  next();
});

Router.get('/search/user', (req, res) => {
  const query = Report.generateQuery(req.query, 'and', userSchema);
  Report.aggregate(query, userSchema)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      debug(err);
      res.status(400).send({
        error: 'Error while fetching reports',
        description: err,
      });
    });
});

Router.get('/dashboard', (req, res) => {
  Report.dashboard()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      debug(err);
      res.status(400).send({
        error: 'Error while fetching reports',
        description: err,
      });
    });
});

module.exports = Router;
