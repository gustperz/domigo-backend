/**
 * ConceptoPagoMensajeros.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'concetos_pagos_mensajeros',

  attributes: {
    nombre: {
      type: 'string'
    },
    empresa: {
      model: 'empresas'
    }
  }
};

