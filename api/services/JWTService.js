/**
 * Created by tav0 on 17/05/16.
 */

"use strict";

const jwt = require('jsonwebtoken');

module.exports.token = {
  encode(payload) {
    return jwt.sign(
      payload,
      sails.config.jwt.secret,
      {
        expiresIn : sails.config.jwt.expiresIn,
        algorithm : sails.config.jwt.algorithm
      }
    );
  },

  decode(token) {
    return jwt.verify(token, sails.config.jwt.secret);
  }
};
