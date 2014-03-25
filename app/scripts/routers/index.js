define([
  'backbone',
  "views/screen",
  "socketio"
  ], function(Backbone, ScreenView, io) {

    var IndexRouter = Backbone.Router.extend({
      routes : {
        'usuarios' : 'usuarios'
      },
      initialize: function(){
        window.socket = io.connect('http://192.168.1.233:9000');
        window.socket.emit('terminalConectado', {});
        this.screenView = new ScreenView();
        Backbone.history.start();
      },
      usuarios: function(){
        console.log('usuarios');
      }
    });

    return IndexRouter;
});
