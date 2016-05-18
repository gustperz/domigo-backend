"use strict";

/**
 * PingController
 * @description :: Server-side logic that checks if app is alive
 */

module.exports = {

  _config: { actions: false, index: false, rest: false },

  index: function(req, res) {
    res.ok(req.allParams(), {message: 'HTTP server is working'});
  }
};
