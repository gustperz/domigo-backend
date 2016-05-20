"use strict";
/**
 * CentralesController
 *
 * @description :: Server-side logic for managing Centrales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config: { actions: false, index: false, rest: true },

  create(req, res) {
    var data = req.allParams();

    const usuario = data.usuario;
    sails.models.usuario.create(usuario)
      .then(_usuario => {
        delete data.usuario;
        data.usuario_id = _usuario.id;
        sails.models.empresas.create(data)
          .then(res.created)
          .catch(error =>{
            sails.models.usuario.destroy({id:_usuario.id});
            res.negotiate(error);
          });
      })
      .catch(res.negotiate);
  }
};

