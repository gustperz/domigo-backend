/**
 * 500 (Internal Server Error) Response
 *
 * A generic error message, given when no more specific message is suitable.
 * The general catch-all error when the server-side throws an exception.
 */

const _ = require('lodash');

module.exports = function (data) {

  // Only include errors in response if application environment
  // is not set to 'production'.  In production, we shouldn't
  // send back any identifying information about errors.
  // if (sails.config.environment === 'production' && sails.config.keepResponseErrors !== true) {
  //   data = undefined;
  // }

  const response = _.assign({
    code: _.get(data, 'code', 'E_INTERNAL_SERVER_ERROR'),
    message: _.get(data, 'message', 'Something bad happened on the server'),
  }, _.get(data, 'root', {}));

  this.res.status(500);
  this.res.jsonx(response);

};
//
// module.exports = function (data, config) {
//   const response = _.assign({
//     code: _.get(config, 'code', 'E_INTERNAL_SERVER_ERROR'),
//     message: _.get(config, 'message', 'Something bad happened on the server'),
//     data: data || {}
//   }, _.get(config, 'root', {}));
//
//   this.res.status(500);
//   this.res.jsonx(response);
// };

