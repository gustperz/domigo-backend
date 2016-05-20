"use strict";

/**
 * Passport configuration file where you should configure all your strategies
 * @description :: Configuration file where you configure your passport authentication
 */

const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

/**
 * Configuration object for local strategy
 * @type {Object}
 * @private
 */
const LOCAL_STRATEGY_CONFIG = {
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
};

/**
 * Configuration object for JWT strategy
 * @type {Object}
 * @private
 */
const JWT_STRATEGY_CONFIG = {
  secretOrKey: require('../config/jwt.js').jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  authScheme: 'Bearer',
  session: false,
  passReqToCallback: true
};

const error_user_notfound = {
  code: 'E_USER_NOT_FOUND',
  message: 'User with specified credentials is not found',
  status: 401
}


/**
 * Triggers when user authenticates via local strategy
 * @param {Object} req Request object
 * @param {String} username Username from body field in request
 * @param {String} password Password from body field in request
 * @param {Function} next Callback
 * @private
 */
const _onLocalStrategyAuth = (req, username, password, next) => {
  sails.models.usuario
    .findOne({[LOCAL_STRATEGY_CONFIG.usernameField]: username})
    .then(user => {
      if (!user) return next(null, null, error_user_notfound);
      if (!HashService.bcrypt.compareSync(password, user.password)) return next(null, null, error_user_notfound);
      return next(null, user, {});
    })
    .catch(next);
};

/**
 * Triggers when user authenticates via JWT strategy
 * @param {Object} req Request object
 * @param {Object} payload Decoded payload from JWT
 * @param {Function} next Callback
 * @private
 */
const _onJwtStrategyAuth = (req, payload, next) => {
  sails.models.usuario
    .findOne({id: payload.id})
    .then(user => {
      if (!user) return next(null, null, error_user_notfound);
      return next(null, user, {});
    })
    .catch(next);
};

passport.use(new LocalStrategy(_.assign({}, LOCAL_STRATEGY_CONFIG), _onLocalStrategyAuth));
passport.use(new JwtStrategy(_.assign({}, JWT_STRATEGY_CONFIG), _onJwtStrategyAuth));

module.exports.passport = {
  /**
   * Triggers when all Passport steps is done and user profile is parsed
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Object} error Object with error info
   * @param {Object} user User object
   * @param {Object} info Information object
   * @returns {*}
   * @private
   */
  onPassportAuth(req, res, error, user, info) {
    if (error || !user) return res.negotiate(error || info);
    return res.ok({
      token: JWTService.token.encode({id: user.id}),
      user: user
    });
  }
};
