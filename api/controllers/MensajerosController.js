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
            if (newMensajero.activo) {
              empresa.n_mensajeros_activos += 1;
              console.log(empresa.toJSON());
              empresa.save();
            } else {
              empresa.n_mensajeros_inactivos += 1;
              empresa.save();
            }
          });
        res.created(newMensajero);
      }).catch(res.negotiate);
  },

  update(req, res){
    const data = req.allParams();
    if('activo' in data) delete data.activo;
    Mensajero
      .update({id: req.params.id}, data)
      .then(records => records[0] ? res.ok(records[0]) : res.notFound())
      .catch(res.negotiate);
  },

  updateEstado(req, res){
    const data = req.allParams();
    Mensajero
      .update({id: req.params.id}, data)
      .then(records => {
        if(!records[0]) return res.notFound();
        const mensajero = records[0];
        Empresa.findOne({id: mensajero.empresa})
          .exec((err, empresa) => {
            if (mensajero.activo) {
              empresa.n_mensajeros_activos += 1;
              empresa.n_mensajeros_inactivos -= 1;
              empresa.save();
            } else {
              empresa.n_mensajeros_inactivos += 1;
              empresa.n_mensajeros_activos -= 1;
              empresa.save();
            }
          });
        res.ok(mensajero);
      }).catch(res.negotiate);
  },

  destroy(req, res){
    Mensajero
      .destroy({id: req.params.id})
      .then(records => {
        if(!records[0]) return res.notFound();
        const mensajero = records[0];
        Empresa.findOne({id: mensajero.empresa})
          .exec((err, empresa) => {
            if (mensajero.activo) {
              empresa.n_mensajeros_activos -= 1;
              empresa.save();
            } else {
              empresa.n_mensajeros_inactivos -= 1;
              empresa.save();
            }
          });
        res.ok(mensajero);
      }).catch(res.negotiate);
  }
};

