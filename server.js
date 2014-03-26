'use strict';

// Module dependencies
var express = require('express'),
    http = require('http');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Mongo
var mongodb = require('./lib/db/mongo');

// Passport Configuration
var passport = require('./lib/config/passport');

var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
var server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

var io = require('socket.io').listen(server);

// Events
require('./lib/events')(app, io);

// Expose app
exports = module.exports = app;
