'use strict';

var mongoose = require('mongoose'),
    passport = require('passport');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error){
      var errors = [];
      errors.push(error);
      return res.jsonp({
        success: false,
        errors: errors
      });
    }

    req.logIn(user, function(err) {

      if (err){
        console.log(err);
        console.log('err');
        return res.jsonp({
          success: false,
          errors: err.errors
        });
      }

      res.jsonp({
        success: true,
        user: req.user.userInfo
      });

    });
  })(req, res, next);
};
