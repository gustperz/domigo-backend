/**
 * Central.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  identity: 'empresas',
  globalId: 'Empresa',
  attributes: {
    nombre: {
      type: 'string',
      required: true
    },
    nit: {
      type: 'string',
      unique: true,
      required: true
    },
    direccion:{
      type: 'string',
      required: true
    },
    barrio:{
      type: 'string',
      required: true
    },
    ciudad:{
      type: 'string',
      required: true
    },
    localizacion:{
      type: 'json'
    },
    telefonos:{
      type: 'array'
    },
    horario:{
      type: 'array'
    },
    logo:{
      type: 'string'
    },
    activa:{
      type: 'boolean',
      required: true,
      defaultsTo: true
    },
    n_mensajeros: {
      type: 'integer',
      defaultsTo: 0
    },
    actividad: {
      model: 'actividadEmpresa',
    },
    servicios_ofrecidos: {
      conllection: 'servicioEmpresa',
      via: 'empresa'
    },
    conceptos_cobros_: {
      conllection: 'ConceptoPagoMensajeros',
      via: 'empresa'
    },
    usuario: {
      model: 'usuario',
    },
    mensajeros: {
      collection: 'mensajeros',
      via: 'empresa'
    }
  },

  autoCreatedAt: true,
  autoUpdatedAt: true,

  default_return: [
    'nombre',
    'telefonos',
    'ciudad',
    'direccion',
    'activa'
  ],

  afterDestroy(destroyedRecords, next){
    for (var i = 0; i < destroyedRecords.length; i++) {
      Usuario.destroy({id: destroyedRecords[i].usuario}).exec(() => {});
    }
    next();
  }
};

