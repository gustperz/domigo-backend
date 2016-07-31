/**
 * Centrales.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  identity: 'mensajeros',
  globalId: 'Mensajero',
  attributes: {
    cedula: {
      type: 'string',
      required: true,
      unique: true
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
    fotografia:{
      type: 'string'
    },
    vehiculo: {
      type: 'string',
      required: true
    },
    licencia_conducion: {
      type: 'string',
      required: true,
      unique: true,
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
    nombre_referencia: {
      type: 'string',
      required: true
    },
    direccion_referencia: {
      type: 'string',
      required: true
    },
    telefono_referencia: {
      type: 'string',
      required: true
    },
    condicion:{
      type: 'string',
      defaultsTo: 'activo',
      in: ['ausente', 'sancionado', 'activo'],
    },
    estado:{
      type: 'integer',
      required: true,
      defaultsTo: '1',
    },
    enlista_negra:{
      type: 'boolean',
      defaultsTo: false,
    },
    empresa: {
      model: 'empresas'
    },
    sanciones: {
      collection: 'sancion',
      via: 'mensajero'
    },
    domicilios: {
      collection: 'domicilios',
      via: 'mensajero'
    },
    pagos: {
      collection: 'pagos',
      via: 'mensajero'
    },
    n_domicilios_exitosos: {
      type: 'integer',
      defaultsTo: 0
    },
    n_domicilios_rechazados: {
      type: 'integer',
      defaultsTo: 0
    },
    usuario: {
      model: 'usuario',
    },
  },

  autoCreatedAt: true,
  autoUpdatedAt: true,

  default_return: [
  'cedula',
  'nombre',
  'apellidos',
  'telefonos',
  'estado',
  'condicion'
]
};

