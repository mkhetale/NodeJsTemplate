const config = require('../config/' + process.env.NODE_ENV || 'production');
const package = require('../package.json');
const debug = require('debug')(`${package.name}:userCtlr`);
const auth = require('../handlers/auth');
let User = require('../libs/user.js');
let Router = require('express').Router;
Router = new Router();
User = new User();

Router.post('/login', auth.login);

Router.post('/signup', (req, res) => {
  User.insert(req.body, false)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send({
        error: 'Error while inserting user',
        description: err,
      });
    });
});

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
  User.count({})
    .then((result) => {
      res.set('Query-Count', result);
      return User.get({}, {}, options);
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
        error: 'Error while fetching users',
        description: err,
      });
    });
});

Router.get('/search', (req, res) => {
  const regex = new RegExp(`${req.query.global}`, 'i');
  debug('request query', req.query);

  const options = {};
  options.sort = {
    updated_at: -1, // Sort by Date Added DESC
  };
  options.skip = Number(req.query.offset);
  options.limit = Number(req.query.limit);

  const query = {
    userId: regex,
  };

  User.count(query)
    .then((result) => {
      res.set('Query-Count', result);
      return User.get(query, {}, options);
    })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      desc = 'Error while fetching users';
      res.status(400).send(err);
    });
});

Router.get('/count', (req, res) => {
  let query = {};
  if (req.query.type) {
    query = {
      type: req.query.type,
    };
  }

  User.count(query)
    .then((result) => {
      res.status(200).send(`${result}`);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});


Router.get('/:userId', (req, res) => {
  User.getOne({
      userId: req.params.userId,
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
        error: 'Error while fetching users',
        description: err,
      });
    });
});

Router.post('/', (req, res) => {
  User.insert(req.body, false)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send({
        error: 'Error while inserting user',
        description: err,
      });
    });
});

Router.put('/:userId', (req, res) => {
  const query = {
    userId: req.params.userId,
  };

  User.update(query, req.body, false)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send({
        error: 'Error while updating user',
        description: err,
      });
    });
});

Router.delete('/:userId', (req, res) => {
  const query = {
    userId: req.params.userId,
  };

  User.delete(query)
    .then((result) => {
      res.status(200).send({
        success: true,
        description: 'Deleted successfully',
      });
    })
    .catch((err) => {
      res.status(400).send({
        error: 'Error while deleting user',
        description: err,
      });
    });
});

Router.get('/otp/:otp/mobile/:mobileNo', (req, res) => {
  // Check if mobile no and otp exist in the request
  if (!(req.params.hasOwnProperty('mobileNo') && req.params.hasOwnProperty('otp'))) {
    res.status(400).send({
      error: 'Validtion error',
      description: 'Please enter a otp and mobileNo',
    });
    return;
  }

  const query = {
    mobileNo: req.params.mobileNo,
    otp: req.params.otp,
  };

  User.getOne(query)
    .then((result) => {
      if (!result) {
        res.status(400).send({
          error: 'OTP Validation failed',
          description: 'The OTP did not match',
        });
        return;
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      if (err === config.errors.notFound) {
        res.status(404).send(err);
        return;
      }

      res.status(400).send({
        error: 'Error when validating OTP',
        description: err,
      });
    });
});

Router.get('/otp/send/:mobileNo', (req, res) => {
  User.sendOTP(req.params.mobileNo)
    .then((result) => {
      res.status(200).send({
        success: true,
      });
    })
    .catch((err) => {
      if (err === config.errors.notFound) {
        res.status(404).send(err);
        return;
      }

      errorResponse(400, {
        error: 'Error while Sending OTP',
        description: err,
      }, res);
    });
});

errorResponse = (statusCode, err, res) => {
  debug('Error Response', err);
  if (err === config.errors.notFound) {
    return res.status(404).send(err);
  }
  return res.status(statusCode).send(err);
};


module.exports = Router;
