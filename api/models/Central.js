/**
 * Central.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  identity: 'centrales',
  attributes: {
    razon_social: {
      type: 'string',
      required: true,
    },
    nombre_comercial: {
      type: 'string',
      required: true
    },
    nit: {
      type: 'string',
      unique: true,
      required: true
    },
    numero_personeria_juridica: {
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
    email:{
      type: 'string',
      unique: true,
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
    mensajeros: {
      collection: 'mensajeros',
      via: 'central_id'
    }
  },
  default_return: [
    'razon_social',
    'nombre_comercial',
    'nit',
    'numero_personeria_juridica',
    'logo',
    'estado'
  ]
};

