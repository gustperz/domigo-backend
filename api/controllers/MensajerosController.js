"use strict";
/**
 * CentralesController
 *
 * @description :: Server-side logic for managing Centrales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create(req, res){
    const data = req.allParams();
    data.empresa = data.parentid;
    Mensajero
      .create(data)
      .then(newMensajero => {
        Empresa.findOne({id: newMensajero.empresa})
          .exec((err, empresa) => {
            empresa.n_mensajeros += 1;
            empresa.save();
          });
        res.created(newMensajero);
      }).catch(res.negotiate);
  },

  actualize(req, res){
    const estado = req.allParams().estado || req.allParams().condicion;
    if (typeof estado == "number") {
      var data = {estado: estado}
    } else {
      var data = {condicion: estado}
    }
    console.log(data);
    Mensajero
      .update({id: req.params.id}, data)
      .then(records => {
        if (!records[0]) return res.notFound();
        const mensajero = records[0];
        // sails.sockets.broadcast
        res.ok();
      }).catch(res.negotiate);
  },

  // destroy(req, res){
  //   Mensajero
  //     .destroy({id: req.params.id})
  //     .then(records => {
  //       if (!records[0]) return res.notFound();
  //       const mensajero = records[0];
  //       Empresa.findOne({id: mensajero.empresa})
  //         .exec((err, empresa) => {
  //           if (mensajero.activo) {
  //             empresa.n_mensajeros_activos -= 1;
  //             empresa.save();
  //           } else {
  //             empresa.n_mensajeros_inactivos -= 1;
  //             empresa.save();
  //           }
  //         });
  //       res.ok(mensajero);
  //     }).catch(res.negotiate);
  // },

  asignarDomocilio(req, res){
    Domicilio.update(
      {id: req.allParams().solicitud_id},
      {mensajero: req.params.parentid, estado: 'asignado'}
    ).then(res.ok('Domicilio asigando')).catch(res.negotiate);
  }
};

