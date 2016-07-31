"use strict";
/**
 * CentralesController
 *
 * @description :: Server-side logic for managing Centrales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');

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
                  return {
                    id: pago.mensajero.id,
                    nombre: pago.mensajero.nombre,
                    apellidos: pago.mensajero.apellidos,
                    fotografia: pago.mensajero.fotografia,
                    cedula: pago.mensajero.cedula
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
          return {
            fecha: pago.fecha,
            valor: pago.valor,
            concepto: pago.concepto,
            mensajero: {
              id: pago.mensajero.id,
              nombre: pago.mensajero.nombre,
              apellidos: pago.mensajero.apellidos,
              fotografia: pago.mensajero.fotografia,
              cedula: pago.mensajero.cedula
            }
          }
        }));
    });
  },

  getDomicilios(req, res){
    Domicilio.find({
      where: {
        empresa: req.params.parentid,
        fecha_hora_solicitud: limitFecha(req)
      },
      sort: 'fecha_hora_solicitud DESC'
    }).populate('mensajero').populate('cliente').populate('tipo')
      .exec((err, domicilios) => {
      if(err) return res.negotiate(err);
      return res.ok(domicilios.map(domiclio => {
          return {
            fecha: domiclio.fecha_hora_solicitud,
            estado: domiclio.estado,
            direccion_destino: domiclio.direccion_destino,
            tipo: domiclio.tipo,
            mensajero: {
              id: domiclio.mensajero.id,
              nombre: domiclio.mensajero.nombre,
              apellidos: domiclio.mensajero.apellidos
            },
            cliente: {
              id: domiclio.cliente.id,
              nombre: domiclio.cliente.nombre,
              tipo: domiclio.cliente.tipo
            }
          }
        }));
    });
  },

  joinWS(req, res){
    if (!req.isSocket) return res.badRequest();
    sails.sockets.join(req, req.params.parentid);
    return res.ok();
  }

};

function limitFecha(req){
  const actual = moment();
  const fecha_hasta = req.param('fecha_hasta') ? moment(req.param('fecha_hasta')+' 23:59:59') : actual;
  if (req.param('fecha_desde')) {
    var fecha_desde = moment(req.param('fecha_desde'));
  } else {
    actual.date(1);
    var fecha_desde = actual;
  }
  console.log(fecha_desde.toDate(),'**************');
  return {
    '>': fecha_desde.subtract(1, 'd').toDate(),
    '<': fecha_hasta.add(1, 'd').toDate()
  }
}

