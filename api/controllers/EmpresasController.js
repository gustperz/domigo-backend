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
        if(!error.invalidAttributes.username && data.usuario.username) {
          Usuario.destroy({username: data.usuario.username}).exec(() => {});
        }
        res.negotiate(error);
      });
  }
};

