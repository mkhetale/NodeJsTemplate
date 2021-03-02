const config = require('../config/' + process.env.NODE_ENV || 'production');
const auth = require('../handlers/auth');
let File = require('../libs/file.js');
let Router = require('express').Router;
Router = new Router();
File = new File();

Router.post('/login', auth.login);

Router.all('*', auth.authMiddleware, auth.isPrivilaged, (req, res, next) => {
  next();
});

Router.get('/', (req, res) => {
  const options = {};
  options.sort = {
    updatedAt: -1, // Sort by Date Added DESC
  };
  options.skip = Number(req.query.offset);
  options.limit = Number(req.query.limit);

  File.get({}, {}, options)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      if (err === config.errors.notFound) {
        res.status(404).send(err);
        return;
      }

      res.status(400).send({
        error: 'Error while fetching files',
        description: err,
      });
    });
});

Router.get('/:id', (req, res) => {
  File.getOne({
      _id: req.params.id,
    })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      if (err === config.errors.notFound) {
        res.status(404).send(err);
        return;
      }

      res.status(400).send({
        error: 'Error while fetching files',
        description: err,
      });
    });
});

Router.post('/', (req, res) => {
  File.insert(req.body, true)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send({
        error: 'Error while inserting file',
        description: err,
      });
    });
});

Router.put('/:id', (req, res) => {
  const query = {
    _id: req.params.id,
  };

  File.update(query, req.body, false)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send({
        error: 'Error while updating file',
        description: err,
      });
    });
});

Router.delete('/:id', (req, res) => {
  const query = {
    _id: req.params.id,
  };

  File.delete(query)
    .then((result) => {
      res.status(200).send({
        success: true,
        description: 'Deleted successfully',
      });
    })
    .catch((err) => {
      res.status(400).send({
        error: 'Error while deleting file',
        description: err,
      });
    });
});

module.exports = Router;
