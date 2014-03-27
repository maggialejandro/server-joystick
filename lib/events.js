'use strict';
var _ = require("lodash");

/**
 * Application Events
 */
 module.exports = function(app, io) {
  app.set('terminal', {} );
  app.set('jugadores', []);

  io.sockets.on('connection', function (socket) {
    console.log('connect!');

    socket.on('disconnect', function() {
      console.log('disconnect!');

      _.each(app.get('jugadores'), function(jugador, index){
        if(jugador && jugador.socket_id == socket.id)
          app.get('jugadores').splice(index, 1);
      });

      var terminalSocket = io.sockets.socket(app.get('terminal').socket_id);
      terminalSocket.emit('jugadorDesconectado', {jugador_id: socket.id});
    });

    socket.on('terminalConectado', function(data){
      app.set('terminal', {
        socket_id: socket.id
      });
    });

    socket.on('jugadorConectado', function(data){
      app.get('jugadores').push({
        socket_id: socket.id
      });

      var terminalSocket = io.sockets.socket(app.get('terminal').socket_id);
      terminalSocket.emit('nuevoJugador', {
        jugador_id: socket.id,
        nombre: data.nombre
      });
    });

    socket.on('shoot', function(data){
      var terminalSocket = io.sockets.socket(app.get('terminal').socket_id);
      terminalSocket.emit('shoot', {jugador_id: socket.id});
    });

    socket.on('move', function(coordenadas){
      var terminalSocket = io.sockets.socket(app.get('terminal').socket_id);

      var data = {
        coordenadas: coordenadas,
        jugador_id: socket.id
      };

      terminalSocket.emit('move', data);
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
