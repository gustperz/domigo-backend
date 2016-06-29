"use strict";
/**
 * CentralesController
 *
 * @description :: Server-side logic for managing Centrales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
//const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const uid = require('sails/node_modules/uid-safe')

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

    Mensajero
      .update({id: req.params.id}, data)
      .then(records => {
        if (!records[0]) return res.notFound();
        const mensajero = records[0];
        // sails.sockets.broadcast
        if (estado == "sancionado"){
          Sancion.create({ razon: req.allParams().razon, mensajero: mensajero.id }).exec(()=>{});
        }
        res.ok();
      }).catch(res.negotiate);
  },

  saveImagen(req, res){
    Mensajero.findOne({id: req.params.id})
      .then((mensajero) => {
        if(mensajero){
          req.file('fotografia').upload({
              dirname: sails.config.appPath + '/public/images/mensajeros',
              saveAs: function (__newFileStream, cb) {
                cb(null, mensajero.fotografia || uid.sync(18) + mensajero.id +'.'+ _.last(__newFileStream.filename.split('.')));
              }
            },
            (error, uploadedFiles) => {
              if (error) return res.negotiate(error);
              if(!uploadedFiles[0]) return res.badRequest('ha ocurrido un erro inesperado al almacenar la imagen');
              const filename = _.last(uploadedFiles[0].fd.split('/'));
              mensajero.fotografia = filename;
              mensajero.save((err, s) => res.ok('files upload'));
            }
          );
        } else {
          return res.notFound('el mensajero no existe');
        }
      }).catch(res.negotiate);
  },

  getHistorialDomicilios(req, res){
    const limit = actionUtil.parseLimit(req);
    const skip = (req.param('page')-1) * limit || actionUtil.parseSkip(req);
    const sort = actionUtil.parseSort(req);
    const where = {
      mensajero: req.params.parentid,
      estado: 'finalizado'
    };

    Domicilio.count(where).exec((err, total) => {
      if(err) return res.negotiate(err);
      Domicilio.find(where).limit(limit).skip(skip).sort(sort)
        .then(records => [records, {
          root: {
            limit: limit,
            total: total,
            start: skip + 1,
            end: skip + limit,
            page: Math.floor(skip / limit) + 1
          }
        }])
        .spread(res.ok)
        .catch(res.negotiate);
    });
  },

  addDomicilio(req, res) {
    const values = req.allParams();
    values.cliente.direccion || (values.cliente.direccion = values.direccion_origen);
    Cliente.findOrCreate(values.cliente).exec((err, cliente) => {
      if(err || !cliente) return res.negotiate(err);
      Domicilio.create({
        direccion_origen: values.direccion_origen,
        direccion_destino: values.direccion_destino,
        descripcion: values.descripcion,
        tipo: values.tipo,
        empresa: values.empresa,
        mensajero: req.params.parentid,
        cliente: cliente.id
      }).exec((err, domicilio) => {
        if (err) return res.negotiate(err);
        return res.ok(domicilio);
      });
    });
  },

  findUltimaSancion(req, res){
    Sancion.find({mensajero: req.params.parentid})
      .sort({fecha: 1}).limit(1).then(results => {
      return res.ok(results ? results[0] : {});
    }).catch(res.negotiate);
  }

}

