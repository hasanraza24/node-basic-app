const expressJwt = require('express-jwt');
const _ = require('lodash');
const config = require('../config/config');

const excludeUrls = [
  {
     url: '/users/register',
     method: 'POST',
  },
  {
      url: '/users/login',
      method: 'POST'
  },
  {
    url: '/users/forgot-pwd',
    method: 'POST'
  },
  {
    url: '/users/reset-password',
    method: 'POST'
  }
];


function authHandler(req, res, next) {
  if (_.find(excludeUrls, { url: req.path, method: req.method })) {
    return next();
  }
  const jwtMiddleWare = expressJwt({ secret: config.jwtSecret, requestProperty: 'user', getToken });
  return jwtMiddleWare(req, res, next);
}

function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}


module.exports = authHandler;