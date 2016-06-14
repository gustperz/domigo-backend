"use strict";

/**
 * https://github.com/tjwebb/sails-swagger
 */

const _ = require('sails/node_modules/lodash');
const xfmr = require('./lib/xfmr');

module.exports = sails => {
  return {
    defaults(overrides) {
      
      return {
        'swagger': {
          pkg: {
            name: 'No package information',
            description: 'You should set sails.config.swagger.pkg to retrieve the content of the package.json file',
            version: '0.0.1'
          }
        }
      };
    },

    initialize(cb) {
      let hook = sails.hooks.swagger;

      sails.after('lifted', () => {
        hook.doc = xfmr.getSwagger(sails, sails.config.swagger.pkg);
      });

      cb();
    }

  }
};
