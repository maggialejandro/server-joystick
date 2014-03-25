'use strict';

var index = require('./controllers/index');

/**
 * Application routes
 */
module.exports = function(app) {

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  app.get('/*', index.index);
};