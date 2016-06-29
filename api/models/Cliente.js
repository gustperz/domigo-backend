/**
 * Cliente.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  identity: 'clientes',
  globalId: 'Cliente',
  attributes: {
    nombre: {
      type: 'string',
      required: true,
    },
    direccion: {
      type: 'string',
      required: true
    },
    barrio: {
      type: 'string',
      required: true
    },
    telefono: {
      type: 'string',
      required: true,
      unique: true
    },
    tipo: {
      type: 'string',
      required: true,
      in: ['empresa', 'particular']
    },
    solicitudes: {
      collection: 'domicilios',
      via: 'cliente'
    }
  },

  autoCreatedAt: true,
  autoUpdatedAt: true,

  default_return: [
  'nombre',
  'direccion',
  'barrio',
  'telefono'
]
};

