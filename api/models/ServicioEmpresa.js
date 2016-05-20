/**
 * ServicioEmpresa.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  tableName: 'servicios_empresa',

  attributes: {
    empresa: {
      model: 'empresas',
      columnName: 'empresa_id'
    },
    tipo_servicio: {
      model: 'tipoServicio',
      columnName: 'tipo_servicio_id'
    },
    valor: {
      type: 'float',
      required: true,
    }
  }
};

