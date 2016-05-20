/**
 * Centrales.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  identity: 'mensajeros',
  attributes: {
    cedula: {
      type: 'string',
      required: true,
    },
    nombre: {
      type: 'string',
      required: true,
    },
    apellidos: {
      type: 'string',
      required: true
    },
    fecha_nacimiento: {
      type: 'date',
      required: true
    },
    sexo: {
      type: 'string',
      required: true
    },
    direccion: {
      type: 'string',
      required: true
    },
    barrio: {
      type: 'string',
      required: true
    },
    ciudad: {
      type: 'string',
      required: true
    },
    telefonos: {
      type: 'array',
      required: true
    },
    email: {
      type: 'string',
      unique: true,
    },
    vehiculo: {
      type: 'string',
      required: true
    },
    licencia_conducion: {
      type: 'string',
      required: true
    },
    licencia_tipo: {
      type: 'string',
      required: true
    },
    fecha_expedicion_licencia: {
      type: 'date',
      required: true
    },
    fecha_vencimiento_licencia: {
      type: 'date',
      required: true
    },
    estado: {
      type: 'string',
      required: true,
      defaultsTo: 'activa'
    },
    empresa: {
      model: 'empresas'
    }
  }
};

