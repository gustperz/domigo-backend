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
      type: 'json',
      required: true
    },
    telefonos:{
      type: 'array',
      required: true
    },
    horario:{
      type: 'array'
    },
    logo:{
      type: 'string',
      required: true
    },
    estado:{
      type: 'string',
      required: true,
      defaultsTo: 'activa'
    },
    actividad: {
      model: 'actividadEmpresa',
    },
    servicios_ofrecidos: {
      conllection: 'servicioEmpresa',
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
    'estado'
  ],

  afterDestroy(destroyedRecords, nex){
    for (var i = 0; i < destroyedRecords.length; i++) {
      Usuario.destroy({id: destroyedRecords[i].usuario}).exec(() => {});
    }
    nex();
  }
};

