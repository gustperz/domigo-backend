/**
 * Created by tav0 on 16/05/16.
 */

const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = function(req, res, next) {
  if(['find', 'findOne'].indexOf(req.options.action) != -1) {
    var model = actionUtil.parseModel(req);
    if (req.param('fields')) {
      var fields = req.param('fields').replace(/ /g, '').split(',');
      if (!fields.every(field => (field in model.attributes))) {
        return res.badRequest({'error': 'error in fields, mk tas mandando una que no existe'});
      }
    }
  }
  next();
};
