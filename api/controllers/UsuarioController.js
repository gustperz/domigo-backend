"use strict";

/**
 * AuthController
 * @description :: Server-side logic for manage users' authorization
 */

const _ = require('lodash');
const passport = require('passport');

module.exports = {

  _config: { actions: false, index: false, rest: false },

  /**
   * Sign in by email\password
   * @param req
   * @param res
   */
  token(req, res) {
    passport.authenticate('local', _.partial(sails.config.passport.onPassportAuth, req, res))(req, res);
  },

  /**
   * Sign up by email\password
   * @param req
   * @param res
   */
  registro(req, res) {
    Usuario
      .create(_.omit(req.allParams(), 'id'))
      .then(function (user){
        return {
          token: JWTService.token.encode({id: user.id}),
          user: user
        }
      })
      .then(res.created)
      .catch(res.negotiate);
  },

  /**
   * Accept JSON Web Token and updates with new one
   * @param req
   * @param res
   */
  // refresh_token(req, res) {
  //   if (!req.param('token')) return res.badRequest(null, {message: 'You must provide token parameter'});
  //
  //   const oldDecoded = JWTService.token.decode(req.param('token'));
  //
  //   res.ok({
  //     token: JWTService.token.encode({id: oldDecoded.id})
  //   });
  // }
};
