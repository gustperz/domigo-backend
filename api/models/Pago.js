/**
 * Pago.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  identity: 'pagos',
  globalId: 'Pago',

  attributes: {
    fecha: {
      type: 'date',
      defaultsTo: new Date()
    },
    valor: {
      type: 'float',
      required: true
    },
    concepto: {
      model: 'ConceptoPagoMensajeros'
    },
    mensajero: {
      model: 'mensajeros'
    }
  }
};

