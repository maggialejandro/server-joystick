'use strict';

exports.register = function(req, res) {
  console.log('re bien');
  console.log(req.query.hola);
  res.jsonp({success: true});
};
