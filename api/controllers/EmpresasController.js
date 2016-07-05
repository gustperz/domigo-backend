"use strict";
/**
 * CentralesController
 *
 * @description :: Server-side logic for managing Centrales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create(req, res) {
    var data = req.allParams();
    if(!data.usuario) return res.badRequest('informacion de acceso de la empresa no enviada');
    data.usuario.rol = 'EMPRESA'; //TODO: ojo con este numero
    Empresa.create(data)
      .then(res.created)
      .catch(error =>{
        if(!error.invalidAttributes.username && data.usuario.username) {
          Usuario.destroy({username: data.usuario.username}).exec(() => {});
        }
        res.negotiate(error);
      });
  },

  updateEstado(req, res){
    if(!req.allParams().estado){
      return res.badRequest('y el campo estado?')
    }
    Empresa
      .update({id: req.params.id}, {activa: req.allParams().estado})
      .then(records => {
        if (!records[0]) return res.notFound();
        res.ok();
      }).catch(res.negotiate);
  },

  joinWS(req, res){
    if (!req.isSocket) return res.badRequest();
    sails.sockets.join(req, req.user.empresa.id);
    return res.ok();
  }
};

