"use strict";

/**
 * ClientesController
 * @description :: Server-side logic that checks if app is alive
 */

module.exports = {

    _config: {actions: false, index: false, rest: false},

    newCall: function (req, res) {
        if (!req.isSocket) return res.badRequest();
        sails.sockets.join(req, req.user.empresa.id);
        const telefono = req.allParams().telefono;
        Cliente.findOne({telefono: telefono}).exec((err, cliente) => {
            if (err) return res.negotiate(err);

            if(!cliente){
                cliente = {telefono: telefono}
            }
            console.log(telefono);
            console.log(cliente);
            sails.sockets.broadcast(req.user.empresa.id, 'newCall', cliente);
            return res.ok();
        });
    },

  direccionesFrecuentes(req, res){
    console.log('vale verga')
        const direccion = req.param('direccion', 'destino');
        Domicilio.query({
            text: 'select distinct direccion_$1 from domicilios like %$2 and cliente = $3',
            values: [direccion, req.params.search, req.params.parentid,]
        }, (err, result) => {
            if (err) return res.negotiate(err);
            return res.ok(result.rows);
        })
    },
}
