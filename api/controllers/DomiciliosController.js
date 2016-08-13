/**
 * DomiciliosController
 *
 * @description :: Server-side logic for managing Domicilios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');

module.exports = {

  create(req, res) {
    var values = req.allParams();

    if(values.mensajeros.length <= 0) res.badRequest('no se ha seleccionado ningun mensajero');

    if(!values.cliente) res.badRequest('un domicilio sin cliente, en serio?');

    if(!values.cliente.id) {
      values.cliente.direccion = values.direccion_origen;
      Cliente.create(values.cliente).exec((err, cliente) => {
        if(err) return res.negotiate(err);

        values.cliente.id = cliente;
        createDomicilio();
        return res.ok();
      })
    } else {
      createDomicilio();
      return res.ok();
    }

    function createDomicilio() {
      for(var i = 0; i < values.mensajeros.length; i++) {
        Domicilio.create({
          direccion_origen: values.direccion_origen,
          direccion_destino: values.direccion_destino,
          descripcion: values.descripcion,
          tipo: values.tipo,
          empresa: values.empresa,
          mensajero: values.mensajeros[i],
          cliente: values.cliente.id,
          fecha_hora_solicitud: moment().toDate()
        }).exec(()=>{});
      }
    }
  }
};

