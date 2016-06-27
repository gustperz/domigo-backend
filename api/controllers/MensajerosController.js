"use strict";
/**
 * CentralesController
 *
 * @description :: Server-side logic for managing Centrales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const _ = require('lodash');

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

  saveImagen(req, res){
    Mensajero.findOne({id: req.params.id})
      .then((mensajero) => {
        req.file('imagen').upload({
            dirname: sails.config.appPath + '/public/images/mensajeros',
            saveAs: function (__newFileStream, cb) {
              cb(null, mensajero.fotografia || __newFileStream);
            }
          },
          (error, uploadedFiles) => {
            if (error) return res.negotiate(error);
            const filename = _.last(uploadedFiles[0].fd.split('/'));
            mensajero.fotografia = filename;
            mensajero.save((err, s) => res.ok('files upload'));
          }
        );
      }).catch(res.negotiate);
  },

  asignarDomocilio(req, res){
    Domicilio.update(
      {id: req.allParams().solicitud_id},
      {mensajero: req.params.parentid, estado: 'asignado'}
    ).then(res.ok('Domicilio asigando')).catch(res.negotiate);
  }
};

