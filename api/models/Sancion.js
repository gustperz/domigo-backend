/**
 * Sancion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  tableName: 'sanciones_mensajeros',

  attributes: {
    fecha: {
      type: 'date',
      defaultsTo: new Date()
    },
    razon: {
      type: 'string',
      required: true
    },
    mensajero: {
      model: 'mensajeros'
    }
  }
};

