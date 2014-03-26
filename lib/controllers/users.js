'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

var nodemailer = require("nodemailer");

/**
 * Create user
 */
exports.create = function (req, res, next) {

  var newUser = new User({
    email: req.query.email,
    name: req.query.name,
    password: req.query.password
  });

  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) {
      return res.jsonp({
        success: false,
        errors: err.errors
      });
    }

    req.logIn(newUser, function(err) {
      if (err) {
        console.log(err)
        console.log('err22');
        return next(err);
      }

      var mail = nodemailer.mail;

      var message = {
        from: 'Sia Interactive <alejandrom@siainteractive.com>',
        to: '"'+req.query.name+'" <alejandrom@siainteractive.com>',
        subject: 'Nodemailer is unicode friendly ✔', //
        html:'Codigo de activacion: <b>1234</b>'
      };

      mail(message);

      return res.jsonp({
        success: true,
        user: req.user.userInfo
      });
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};
