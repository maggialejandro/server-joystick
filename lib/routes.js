'use strict';

var index = require('./controllers/index');
var session = require('./controllers/session');

/**
 * Application routes
 */
module.exports = function(app) {

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  app.get('/register*', session.register);

  app.get('/*', index.index);
};
