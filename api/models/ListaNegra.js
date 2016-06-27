/**
 * ListaNegra.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  tableName: 'lista_negra',

  attributes: {
    cedula: {
      type: 'string',
      required: true
    },
    nombre: {
      type: 'string',
      required: true
    },
    fecha: {
      type: 'date',
      defaultsTo: new Date(),
    },
    razon: {
      type: 'string',
      required: true
    },
    denunciante: {
      type: 'string',
      required: true
    },
    denunciante_id: {
      type: 'integer',
      required: true
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.denunciante_id;
      return obj;
    }
  },

  afterCreate(values, next) {
    Mensajero.update({cedula: values.cedula}, {enlista_negra: true}).exec(() => {});
    next();
  },
  afterDestroy(deleted_record, next) {
    Mensajero.update({cedula: deleted_record.cedula}, {enlista_negra: false}).exec(() => {});
    next();
  }
};

