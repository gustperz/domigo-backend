"use strict";
/**
 * CentralesController
 *
 * @description :: Server-side logic for managing Centrales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

const _ = require('lodash');

module.exports = {

  create(req, res){
    const data = req.allParams();
    data.empresa = data.parentid;
    data.usuario = {
      username: data.cedula,
      password: data.cedula,
      rol: 'MENSAJERO',
      email: req.allParams().email || ''
    }
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
        req.file('fotografia').upload({
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
  },

  getHistorialDomicilios(req, res){
    const limit = actionUtil.parseLimit(req);
    const skip = (req.param('page')-1) * limit || actionUtil.parseSkip(req);
    const sort = actionUtil.parseSort(req);

    Domicilio.find()
      .where({
        mensajero: req.params.parentid,
        estado: 'finalizado'
      })
      .limit(limit).skip(skip).sort(sort)
      .then(records => [records, {
        root: { limit: limit, start: skip + 1, end: skip + limit, page: Math.floor(skip / limit) + 1 }
      }])
      .spread(res.ok)
      .catch(res.negotiate);
  }
};

