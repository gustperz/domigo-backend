/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  'get /apidoc': 'ApiDocController.index',
  '/ping': 'PingController.index',

  'post /usuario/token': 'UsuarioController.token',
  'post /usuario/registro': 'UsuarioController.registro',
  // 'get /usuario/refresh_token': 'UsuarioController.refresh_token',

  'get    /empresas': 'EmpresasController.find',
  'post   /empresas': 'EmpresasController.create',
  'get    /empresas/:id': 'EmpresasController.findOne',
  'put    /empresas/:id': 'EmpresasController.update',
  'put    /empresas/:id/estado': 'EmpresasController.updateEstado',
  'delete /empresas/:id': 'EmpresasController.destroy',
  'get    /empresas/:parentid/mensajeros': {controller: 'EmpresasController', action: 'populate', alias: 'mensajeros'},
  'post   /empresas/:parentid/mensajeros': 'MensajerosController.create',
  'get    /empresas/:parentid/join_ws': 'EmpresasController.joinWS',
  'get    /empresas/:parentid/tipos_servicios': {controller: 'EmpresasController', action: 'populate', alias: 'servicios_ofrecidos'},
  'post   /empresas/:parentid/tipos_servicios': {controller: 'EmpresasController', action: 'add', alias: 'servicios_ofrecidos'},
  'get    /empresas/:parentid/conceptos_cobros': {controller: 'EmpresasController', action: 'populate', alias: 'conceptos_cobros'},
  'post   /empresas/:parentid/conceptos_cobros': {controller: 'EmpresasController', action: 'add', alias: 'conceptos_cobros'},


  'get    /mensajeros/:id': 'MensajerosController.findOne',
  'put    /mensajeros/:id': 'MensajerosController.update',
  'put    /mensajeros/:id/estado': 'MensajerosController.actualize',
  'put    /mensajeros/:id/condicion': 'MensajerosController.actualize',
  'delete /mensajeros/:id': 'MensajerosController.destroy',
  'post   /mensajeros/:id/fotografia': 'MensajerosController.saveImagen',
  'get    /mensajeros/:parentid/pagos': {controller: 'MensajerosController', action: 'populate', alias: 'pagos'},
  'post   /mensajeros/:parentid/pagos': {controller: 'MensajerosController', action: 'add', alias: 'pagos'},
  'post   /mensajeros/:parentid/sancion': {controller: 'MensajerosController', action: 'add', alias: 'sanciones'},
  'get    /mensajeros/:parentid/sancion': 'MensajerosController.findUltimaSancion',
  'get    /mensajeros/:parentid/sanciones': {controller: 'MensajerosController', action: 'populate', alias: 'sanciones'},

  'get    /mensajeros/:parentid/domicilios': 'MensajerosController.getHistorialDomicilios',

  'post /clientes/new_call': 'ClientesController.newCall',
  'post /clientes': 'ClientesController.create',
  'get  /clientes/:parentid/direcciones_frecuentes': 'ClientesController.direccionesFrecuentes',

  'post /domicilios': 'DomiciliosController.create',

  'get    /lista_negra': 'ListaNegraController.find',
  'post   /lista_negra': 'ListaNegraController.create',
  'delete /lista_negra': 'ListaNegraController.destroy'
};
