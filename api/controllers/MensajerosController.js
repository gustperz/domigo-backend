"use strict";
/**
 * CentralesController
 *
 * @description :: Server-side logic for managing Centrales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
//const _ = require('lodash');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const uid = require('sails/node_modules/uid-safe');
const moment = require('moment');

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
            }).catch(error => {
            if (!error.invalidAttributes.username && data.usuario.username) {
                Usuario.destroy({username: data.usuario.username}).exec(() => {
                });
            }
            res.negotiate(error);
        });
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
                if (estado == "sancionado") {
                    Sancion.create({razon: req.allParams().razon, mensajero: mensajero.id}).exec(()=> {
                    });
                }
                res.ok();
            }).catch(res.negotiate);
    },

    saveImagen(req, res){
        Mensajero.findOne({id: req.params.id})
            .then((mensajero) => {
                if (mensajero) {
                    req.file('fotografia').upload({
                            dirname: sails.config.appPath + '/public/images/mensajeros',
                            saveAs: function (__newFileStream, cb) {
                                cb(null, mensajero.fotografia || uid.sync(18) + mensajero.id + '.' + _.last(__newFileStream.filename.split('.')));
                            }
                        },
                        (error, uploadedFiles) => {
                            if (error) return res.negotiate(error);
                            if (!uploadedFiles[0]) return res.badRequest('ha ocurrido un erro inesperado al almacenar la imagen');
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
        const skip = (req.param('page') - 1) * limit || actionUtil.parseSkip(req);
        const sort = req.param('sort') ? actionUtil.parseSort(req) : {fecha_hora_solicitud: 0};
        const where = {
            mensajero: req.params.parentid,
            estado: 'finalizado',
            fecha_hora_solicitud: limitFecha(req, true)
        };

        Domicilio.count(where).exec((err, total) => {
            if (err) return res.negotiate(err);
            Domicilio.find(where).populate('tipo').limit(limit).skip(skip).sort(sort)
                .then(domicilios => {
                    if (domicilios) {
                        domicilios.forEach(domicilio => domicilio.tipo = domicilio.tipo.nombre)
                    }
                    return [domicilios, {
                        root: {
                            limit: limit,
                            total: total,
                            start: skip + 1,
                            end: skip + limit,
                            page: Math.floor(skip / limit) + 1
                        }
                    }]
                })
                .spread(res.ok)
                .catch(res.negotiate);
        });
    },

    findUltimaSancion(req, res){
        Sancion.find({mensajero: req.params.parentid})
            .sort({fecha: 1}).limit(1).then(results => {
            return res.ok(results ? results[0] : {});
        }).catch(res.negotiate);
    },

    addPago(req, res){
        console.log(req.params);
        Pago.create({
            mensajero: req.params.parentid,
            empresa: req.user.empresa.id,
            valor: req.allParams().valor,
            concepto: req.allParams().concepto,
            fecha: req.allParams().fecha
        }).then(res.ok).catch(res.negotiate);
    }
};
function limitFecha(req, default_dia) {
    var fecha_hasta = req.param('fecha_hasta') ? moment(req.param('fecha_hasta')) : moment();
    if (req.param('fecha_desde')) {
        var fecha_desde = moment(req.param('fecha_desde'));
    } else {
        default_dia || (default_dia = false);
        var fecha_desde = default_dia ? moment() : moment().date(1);
    }
    fecha_desde.set('hour', 0).set('minute', 0).set('second', 0);
    fecha_hasta.add(1, 'd');
    console.log(fecha_hasta.toDate(), '**************');
    console.log(fecha_desde.toDate(), '**************');
    return {
        '>=': fecha_desde.toDate(),
        '<': fecha_hasta.toDate()
    }
}

