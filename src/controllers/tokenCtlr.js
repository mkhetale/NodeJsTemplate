const auth = require('../handlers/auth');
let Token = require('../libs/token.js');
let Router = require('express').Router;
Router = new Router();

Token = new Token();

Router.post('/login', auth.login);

Router.all('*', auth.authMiddleware, auth.isPrivilaged, (req, res, next) => {
  next();
});

Router.get('/cdn/uploadtoken', (req, res) => {
  Token.uploadToken()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send({
        error: 'Error while fetching token',
        description: err.error,
      });
    });
});

Router.get('/cdn/accesstoken', (req, res) => {
  Token.accessToken()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send({
        error: 'Error while fetching token',
        description: err.error,
      });
    });
});

module.exports = Router;
