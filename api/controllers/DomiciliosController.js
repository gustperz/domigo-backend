/**
 * DomiciliosController
 *
 * @description :: Server-side logic for managing Domicilios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create(req, res) {
    var values = req.allParams();
    values.cliente.direccion || (values.cliente.direccion = values.direccion_origen);
    if(values.mensajeros.length <= 0) res.badRequest('no se ha seleccionado ningun mensajero');
    Cliente.findOne({telefono: values.cliente.telefono}).exec((err, cliente) => {
      if(err) return res.negotiate(err);
      Domicilio.create({
        direccion_origen: values.direccion_origen,
        direccion_destino: values.direccion_destino,
        descripcion: values.descripcion,
        tipo: values.tipo,
        empresa: values.empresa,
        mensajero: values.mensajeros[0],
        cliente: cliente ? cliente.id : values.cliente
      }).exec((err, domicilio) => {
        if (err) return res.negotiate(err);
        if(values.mensajeros.length > 1){
          for(var i = 1; i < values.mensajeros.length; i++){
            Domicilio.create({
              direccion_origen: values.direccion_origen,
              direccion_destino: values.direccion_destino,
              descripcion: values.descripcion,
              tipo: values.tipo,
              empresa: values.empresa,
              mensajero: values.mensajeros[i],
              cliente: domicilio.cliente.id
            }).exec(()=>{});
          }
        }
        return res.ok(domicilio);
      });
    });
  }
};

