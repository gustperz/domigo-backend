/**
 * Domicilio.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  identity: 'domicilios',
  globalId: 'Domicilio',

  attributes: {
    fecha_hora_solicitud: {
      type: 'datetime',
      required: true,
      defaultsTo: new Date()
    },
    fecha_hora_entrega: {
      type: 'datetime'
    },
    direccion_origen: {
      type: 'string',
      required: true
    },
    direccion_destino: {
      type: 'string',
      required: true
    },
    descripcion: {
      type: 'string'
    },
    estado: {
      type: 'string',
      defaultsTo: 'asignado',
      in: ['asignado', 'finalizado']
    },
    tipo: {
      model: 'servicioEmpresa'
    },
    cliente: {
      model: 'clientes'
    },
    empresa: {
      model: 'empresas'
    },
    mensajero: {
      model: 'mensajeros'
    }
  },

  afterCreate(newlyInsertedRecord, next) {
    Mensajero.findOne({id: newlyInsertedRecord.mensajero})
      .exec((err, mensajero) => {
        mensajero.estado = 0;
        mensajero.save(err => {
          // sails.sockets.broadcast
          next();
        });
      });
  }
};

