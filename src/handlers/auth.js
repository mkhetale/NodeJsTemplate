const config = require('../config/' + process.env.NODE_ENV + '.json');
const passport = require('passport');
let User = require('../libs/user.js');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  jwt = require('jsonwebtoken');
const jwtOpts = {};
const handlers = require('../handlers/handlers.js');
const proj = require('../package.json').name;
jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOpts.secretOrKey = config.auth.secretOrKey;
const debug = require('debug')('projectname:auth');

User = new User();

module.exports = {
  jwtStrategy: new JwtStrategy(jwtOpts, (JWTpayload, done) => {
    const query = {
      userId: JWTpayload.userId,
    };

    User.getOne(query)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(null, false);
        // or you could create a new account
      });
  }),
  login: (req, res, next) => {
    let userId;
    let password;

    if (req.body.userId && req.body.password) {
      userId = req.body.userId.toLowerCase();
      password = req.body.password;
    }

    const query = {
      userId: userId,
      password: password,
    };

    User.getOne(query)
      .then((user) => {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        const payload = {
          userId: user.userId,
        };

        const opts = {
          expiresIn: config.auth.expiresIn,
        };
        const token = jwt.sign(payload, jwtOpts.secretOrKey, opts);
        res.status(200).json({
          success: true,
          token: token,
        });
        return;
      })
      .catch((err) => {
        if (err === config.errors.notFound) {
          res.status(401).json({
            success: false,
            error: 'Authentication failed',
          });
          return;
        }

        res.status(400).json({
          success: false,
          error: 'Login Error',
        });
      });
  },

  logout: (req, res) => {
    req.logout();
    return res.send(200);
  },

  authMiddleware: (req, res, next) => {
    passport.authenticate('jwt', function(err, user, info) {
      // If user does not exist Unauthorized
      if (!user) {
        res.status(401).send({
          code: '9001',
          error: 'Unauthorized',
          description: 'Unauthorized',
        });
        return;
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  isPrivilaged: (req, res, next) => {
    // Get the req type
    const method = req.method.toLowerCase();
    // Get the base url
    let url = req.originalUrl;
    // Get the params
    const param = req.params[0];
    // Get the users type
    const userType = req.user.type;
    // Get the routes

    const routes = config.accessRoles[userType][method];

    debug('Request original Url', req.originalUrl);
    debug('Request params', req.params);
    debug('method', method);
    debug('url', url);
    debug('param', param);
    debug('userType', userType);
    debug('routes', routes);
    /*
     Check if the user can post by
      by checking his privilages in the config
    */
    url = url.replace(`/${proj}`, '');
    debug('routes', url);

    const allowed = routes.allowed.reduce(function(acc, val) {
      return acc || handlers.matcher(val, url);
    }, false);

    const notAllowed = routes.notAllowed.reduce(function(acc, val) {
      return acc || handlers.matcher(val, url);
    }, false);

    debug('allowed: ', allowed);
    debug('notAllowed: ', notAllowed);

    if (allowed && !notAllowed) {
      next();
      return;
    }

    return res.status(401).send({
      code: '9002',
      error: 'Unauthorized',
      description: 'Unauthorized',
    });
  },
  isAdmin: function(req, res, next) {
    if (req.user.type === 'admin') {
      next();
      return;
    }
    return res.status(401).send({
      code: '9003',
      error: 'Unauthorized',
      description: 'Unauthorized',
    });
  },
  isProjectOwner: function(req, res, next) {
    const projects = req.user.projects;

    if (projects.indexOf(req.params.key) > -1 || projects.indexOf('*') > -1) {
      next();
      return;
    }
    return res.status(401).send({
      code: '9004',
      error: 'Unauthorized',
      description: 'Unauthorized',
    });
  },
};
