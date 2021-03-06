"use strict";
/**
 * CentralesController
 *
 * @description :: Server-side logic for managing Centrales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
const uid = require('sails/node_modules/uid-safe')

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

  getUltimosPagos(req, res){
    Pago.query(
      'SELECT SUM(valor) as total FROM pagos t where t.fecha > NOW() - INTERVAL 7 DAY and empresa = '+req.params.parentid,
      (err, results) => {
        if(err) return res.negotiate(err);
        const total_semana = results[0].total;
        Pago.query(
          'SELECT SUM(valor) as total FROM pagos t where t.fecha > NOW() - INTERVAL 30 DAY and empresa = '+req.params.parentid,
          (err, results) => {
            if(err) return res.negotiate(err);
            const total_mes = results[0].total;
            Pago.find({
              where: {empresa: req.params.parentid},
              sort: 'fecha DESC',
              limit: 5
            }).populate('mensajero').exec((err, pagos) => {
              if(err) return res.negotiate(err);
              return res.ok({
                total_mes: total_mes || 0,
                total_semana: total_semana || 0,
                mensajeros: pagos.map(pago => {
                  if(pago.mensajero) {
                    return {
                      id: pago.mensajero.id,
                      nombre: pago.mensajero.nombre,
                      apellidos: pago.mensajero.apellidos,
                      fotografia: pago.mensajero.fotografia,
                      cedula: pago.mensajero.cedula
                    }
                  } else {
                    return {
                      nombre: 'Fuera de servicio'
                    }
                  }
                })
              });
            });
          }
        );
      }
    );
  },

  getPagos(req, res){

    Pago.find({
      where: {
        empresa: req.params.parentid,
        fecha: limitFecha(req)
      },
      sort: 'fecha DESC'
    }).populate('mensajero').populate('concepto').exec((err, pagos) => {
      if(err) return res.negotiate(err);
      return res.ok(pagos.map(pago => {
        var data = {
          fecha: pago.fecha,
          valor: pago.valor,
          concepto: pago.concepto,
          mensajero: {
            nombre: 'Fuera de servicio'
          },
        }
        if(pago.mensajero){
          data.mensajero = {
            id: pago.mensajero.id,
            nombre: pago.mensajero.nombre,
            apellidos: pago.mensajero.apellidos,
            fotografia: pago.mensajero.fotografia,
            cedula: pago.mensajero.cedula
          }
        }
        return data;
        }));
    });
  },

  getDomicilios(req, res){
    Domicilio.find({
      where: {
        empresa: req.params.parentid,
        fecha_hora_solicitud: limitFecha(req, true)
      },
      sort: 'fecha_hora_solicitud DESC'
    }).populate('mensajero').populate('cliente').populate('tipo')
      .exec((err, domicilios) => {
      if(err) return res.negotiate(err);
      return res.ok(domicilios.map(domiclio => {
        var data = {
          id: domiclio.id,
          fecha: domiclio.fecha_hora_solicitud,
          estado: domiclio.estado,
          direccion_destino: domiclio.direccion_destino,
          direccion_origen: domiclio.direccion_origen,
          tipo: domiclio.tipo,
          mensajero: {
            nombre: 'Fuera de servicio'
          },
          cliente: {
            id: domiclio.cliente.id,
            nombre: domiclio.cliente.nombre,
            tipo: domiclio.cliente.tipo,
            telefono: domiclio.cliente.telefono,
          }
        }
        if(domiclio.mensajero){
          data.mensajero = {
            id: domiclio.mensajero.id,
            nombre: domiclio.mensajero.nombre,
            apellidos: domiclio.mensajero.apellidos,
            telefono: domiclio.mensajero.telefono,
          }
        }
        return data;
      }));
    });
  },

  joinWS(req, res){
    if (!req.isSocket) return res.badRequest();
    sails.sockets.join(req, req.params.parentid);
    return res.ok();
  },

  saveLogo(req, res){
    Empresa.findOne({id: req.params.id})
        .then((empresa) => {
          if(empresa){
            req.file('logo').upload({
                  dirname: sails.config.appPath + '/public/images/empresas',
                  saveAs: function (__newFileStream, cb) {
                    cb(null, empresa.logo || uid.sync(18) + empresa.id +'.'+ _.last(__newFileStream.filename.split('.')));
                  }
                },
                (error, uploadedFiles) => {
                  if (error) return res.negotiate(error);
                  if(!uploadedFiles[0]) return res.badRequest('ha ocurrido un erro inesperado al almacenar la imagen');
                  const filename = _.last(uploadedFiles[0].fd.split('/'));
                  empresa.logo = filename;
                  empresa.save((err, s) => res.ok('files upload'));
                }
            );
          } else {
            return res.notFound('la empresa no existe');
          }
        }).catch(res.negotiate);
  }

};

function limitFecha(req, default_dia){
  var fecha_hasta = req.param('fecha_hasta') ? moment(req.param('fecha_hasta')) : moment();
  if (req.param('fecha_desde')) {
    var fecha_desde = moment(req.param('fecha_desde'));
  } else {
    default_dia || (default_dia = false);
    var fecha_desde = default_dia ? moment() : moment().date(1);
  }
  fecha_desde.set('hour', 0).set('minute', 0).set('second', 0);
  fecha_hasta.set('hour', 0).set('minute', 0).set('second', 0);
  fecha_hasta.add(1, 'd');
  console.log(fecha_hasta.toDate(),'**************');
  console.log(fecha_desde.toDate(),'**************');
  return {
    '>=': fecha_desde.toDate(),
    '<': fecha_hasta.toDate()
  }
}
