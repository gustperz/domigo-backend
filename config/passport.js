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

const error_user_not_valid = {
  code: 'E_USER_NOT_VALID',
  message: 'User with specified credentials is not valid',
  status: 401
}

const error_user_inactive = {
  code: 'E_INACTIVE',
  message: 'User with specified credentials is not valid',
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
  Usuario
    .findOne({[LOCAL_STRATEGY_CONFIG.usernameField]: username})
    .then(user => {
      if (!user) return next(null, null, error_user_notfound);
      if (!HashService.bcrypt.compareSync(password, user.password)) return next(null, null, error_user_notfound);
      if (user.rol == 'EMPRESA'){
        Empresa.findOne({usuario: user.id}).exec((err, empresa ) => {
          if(err || !empresa) return next(null, null, error_user_not_valid);
          if(!empresa.activa)  return next(null, null, error_user_inactive);
          user.empresa = {
            id: empresa.id,
            nombre: empresa.nombre,
            logo: empresa.logo,
          };
          return next(null, user, {});
        });
      } else if (user.rol == 'MENSAJERO') {
          Mensajero.findOne({usuario: user.id}).exec((err, mensajero) => {
              if (err || !mensajero) return next(null, null, error_user_not_valid);
              if (!mensajero.enlista_negra)  return next(null, null, error_user_inactive);
              user.mensajero = {
                  id: mensajero.id,
                  cedula: mensajero.cedula,
                  nombre: mensajero.nombre,
                  apellidos: mensajero.apellidos,
                  fotografia: mensajero.fotografia,
                  telefono: mensajero.telefono,
                  email: mensajero.email,
              };
              return next(null, user, {});
          });
      } else {
        return next(null, user, {});
      }
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
  Usuario
    .findOne({id: payload.user.id})
    .then(user => {
      if (!user) return next(null, null, error_user_notfound);
      return next(null, payload.user, {});
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
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    return res.ok({
      token: JWTService.token.encode({user: user}),
      user: user
    });
  }
};
