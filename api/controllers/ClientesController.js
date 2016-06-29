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

      if (!cliente) {
        cliente = {telefono: telefono}
      } else {
        cliente.direccion_origen = cliente.direccion;
        delete cliente.direccion;
      }
      sails.sockets.broadcast(req.user.empresa.id, 'newCall', cliente);
      return res.ok();
    });
  },

  direccionesFrecuentes(req, res){
    console.log('vale verga')
    var direccion = req.param('direccion', 'destino');
    if(direccion != 'origen' && direccion != 'destino') return res.notFound(direccion+' no es un tipo de direccion');
    if (direccion == 'origen') {
      Domicilio.find({
        direccion_origen: {'startsWith': req.params.search},
        cliente: req.params.parentid
      }, {select:['direccion_origen']})
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          return res.ok(result.map(item => item.direccion_origen));
        })
    } else {
      Domicilio.find({
        direccion_destino: {'startsWith': req.params.search},
        cliente: req.params.parentid
      }, {select:['direccion_destino']})
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          return res.ok(result.map(item => item.direccion_destino));
        })
    }
  },
}
