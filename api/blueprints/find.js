"use strict";

const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

const takeAlias = _.partial(_.map, _, item => item.alias);
const populateAlias = (model, alias) => model.populate(alias);

/**
 * Find Records
 * GET /:model
 *
 * An API call to find and return model instances from the data adapter using the specified criteria.
 * If an id was specified, just the instance with that unique id will be returned.
 */
module.exports = (req, res) => {
  _.set(req.options, 'criteria.blacklist', ['fields', 'populate', 'limit', 'skip', 'page', 'sort']);

  const populate = req.param('populate') ? req.param('populate').replace(/ /g, '').split(',') : [];
  const Model = actionUtil.parseModel(req);
  if(req.param('fields')){
    var fields = req.param('fields') != 'all' ? req.param('fields').replace(/ /g, '').split(',') : [];
  } else {
    var fields = Model.default_return || [];
  }
  const where = actionUtil.parseCriteria(req);
  const sort = actionUtil.parseSort(req);

  const query = Model.find(null, fields.length > 0 ? {select: fields} : null).where(where).sort(sort);
  const findQuery = _.reduce(_.intersection(populate, takeAlias(Model.associations)), populateAlias, query); //???

  findQuery
    .then(records => [records])
    .spread(res.ok)
    .catch(res.negotiate);
};
