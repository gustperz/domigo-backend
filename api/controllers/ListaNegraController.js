/**
 * ListaNegraController
 *
 * @description :: Server-side logic for managing Listanegras
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create(req, res) {
    Mensajero.findOne({id: req.allParams().id}).then(mensajero => {
      Empresa.findOne({id: req.user.empresa.id}).then(empresa => {
        ListaNegra.create({
          cedula: mensajero.cedula,
          nombre: mensajero.nombre,
          razon: req.allParams().razon,
          denunciante: empresa.nombre,
          denunciante_id: empresa.id,
        }).exec((err, list_item) => list_item ? res.ok(list_item) : res.negotiate(err));
      }).catch(res.negotiate);
    }).catch(res.negotiate);
  },

  destroy(req, res) {
    ListaNegra.destory({
      cedula: req.allParams().cedula,
      denunciante_id: req.user.empresa.id
    }).exec(err => !err ? res.ok() : res.negotiate(err));
  }
};

