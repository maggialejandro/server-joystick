'use strict';

var mongoose = require('mongoose'),
    path = require('path'),
    fs = require('fs'),
    config = require('./../config/config');

exports.mongoose = mongoose;

// Connect to Database
mongoose.connect(config.mongo.uri, config.mongo.options, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + config.mongo.uri + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + config.mongo.uri);
  }
});

// Bootstrap models
var modelsPath = path.join(__dirname, '/../models/mongo');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});