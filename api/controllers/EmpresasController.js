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
    Empresa.create(data)
      .then(res.created)
      .catch(error =>{
        if(!error.invalidAttributes.username) {
          Usuario.destroy({username: data.usuario.username}).exec(() => {});
        }
        res.negotiate(error);
      });
  },

  // poulateMensajeros(req, res) {
  //   var urlarry = req.url.split('?');
  //   console.log()
  //   var url = '/mensajeros?empresa=' + req.params.parentid + (urlarry[1] ? '&'+ urlarry[1] : '');
  //   return res.redirect(url);
  // }
};

