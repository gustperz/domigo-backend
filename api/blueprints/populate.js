/**
 * Created by tav0 on 21/05/16.
 */

"use strict";
const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
/**
 * Populate an association
 * GET /:model/:parentId/:relation
 * GET /:model/:parentId/:relation/:id
 *
 * Expand response with populated data from relations in models.
 */

// module.exports = require('sails/lib/hooks/blueprints/actions/populate');
module.exports = (req, res) => {
  const urlarry = req.url.split('?');
  const other_criteria = urlarry[1] ? '&'+urlarry[1] : '';
  var relation = req.options.alias;
  if (!relation) {
    return res.serverError(new Error(urlarry[0]+" no es uan url valida, Missing required route option, `req.options.alias`."));
  }
  const association = _.find(req.options.associations, {'alias': relation});
  if (!association) {
    return res.serverError(new Error('url invalida '+urlarry[0]+'. '+req.options.model+'.'+relation+' undefined.'));
  }
  const criteria = association.via+'='+req.params.parentid;
  req.url = '/'+association.collection+'?'+criteria+other_criteria;
  console.log('                  '+req.url);
  req.query[association.via] = req.params.parentid;
  req.options.model = association.collection;
  delete req.params.parentid;
  return require('./find')(req, res);
}
