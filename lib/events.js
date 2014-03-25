'use strict';
var _ = require("lodash");

/**
 * Application Events
 */
 module.exports = function(app, io) {
  app.set('terminal', {} );

  io.sockets.on('connection', function (socket) {
    console.log('conectado!');

    socket.on('terminalConectado', function(data){
      app.set('terminal', {
        socket_id: socket.id
      });
    });

    socket.on('shoot', function(data){
      var socket_id = app.get('terminal').socket_id;
      var socket = io.sockets.socket(socket_id);
      socket.emit('shoot');
    });

    socket.on('move', function(coordenadas){
      var socket_id = app.get('terminal').socket_id;
      var socket = io.sockets.socket(socket_id);
      console.log(coordenadas);
      socket.emit('move', coordenadas);
    });

    socket.on('terminal', function (data){
      app.set('terminal').push({
        socket_id : socket.id
      });
    });

    socket.on('jugadorConectado', function(data){
      app.get('jugadores').push({
        socket_id: socket.id
      });
    });

    socket.on('touched', function (data) {
      if(!_.isEmpty(app.get('terminal'))){
        var socket_id = app.get('terminal')[0].socket_id;

        var terminal = _.find(io.sockets.clients(), function(sock){
          return sock.id == socket_id;
        });

        terminal.emit('evento', {
          data: data,
          jugador: socket.id
        });
      }else{
        console.log('El equipo terminal no esta conectado');
      }

    });
  });
 };
