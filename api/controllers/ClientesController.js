"use strict";

/**
 * ClientesController
 * @description :: Server-side logic that checks if app is alive
 */

module.exports = {

  _config: {actions: false, index: false, rest: false},

  newCall: function (req, res) {
    if (!req.isSocket) return res.badRequest();
    sails.sockets.join(req, req.user.empresa.id);
    const telefono = req.allParams().telefono;
    Cliente.findOne({telefono: telefono}).exec((err, cliente) => {
      if (err) return res.negotiate(err);

      var solicitud = { cliente: {} };
      if (!cliente) {
        solicitud.cliente.telefono = telefono
      } else {
        solicitud.cliente = cliente;
        solicitud.direccion_origen = cliente.direccion;
      }
      sails.sockets.broadcast(req.user.empresa.id, 'newCall', solicitud);
      return res.ok();
    });
  },

  direccionesFrecuentes(req, res){
    console.log('vale verga')
        const direccion = req.param('direccion', 'origen');
        Domicilio.query(
          'select distinct direccion_'+direccion+' from domicilios where cliente = '+req.params.parentid,
          (err, result) => {
            if (err) return res.negotiate(err);
            return res.ok(result.map(item => item['direccion_'+direccion]));
        })
    }
}

