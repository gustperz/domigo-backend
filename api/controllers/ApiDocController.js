"use strict";

module.exports = {

  _config: { actions: false, index: false, rest: false },

  index: function (req, res) {
    res.status(200).jsonx(sails.hooks.swagger.doc);
  }
};
