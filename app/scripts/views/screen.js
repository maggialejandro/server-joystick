define([
    "backbone",
    "underscore",
    "jquery",
    "models/joystick",
    "views/ship",
    "views/bullet",
    "text!templates/screen.html",
    "vector2",
    "collections/jugadores",
    "models/jugador"
    ], function(Backbone, _, $, JoystickModel, ShipView, BulletView, screenTemplate, Vector2, JugadoresList, JugadorModel) {

    var ScreenView = Backbone.View.extend({
        el: $("#app"),
        initialize: function(){
          this.template = _.template(screenTemplate);

          this.model = new JoystickModel();

          this.jugadores = new JugadoresList();

          window.tempVector = new Vector2();

          this.canvas = document.createElement( 'canvas' );
          this.context = this.canvas.getContext( '2d' );

          this.ships = [];

          this.bullets = [];
          this.spareBullets = [];

          this.render();
        },
        render: function(){
          this.$el.html(this.template());
          this.$('.container').html(this.canvas);

          this.resetCanvas();

          var that = this;

          window.socket.on('nuevoJugador', function(data){
            var shipView = new ShipView({x: that.model.get('halfWidth'), y: that.model.get('halfHeight')});
            shipView.model.set({jugador_id: data.jugador_id});
            that.ships.push(shipView);
            that.$('.container').after(shipView.canvas);

            var jugador = new JugadorModel();

            jugador.set({
              id: data.jugador_id,
              color: shipView.model.get('color')
            });

            that.jugadores.add(jugador);
          });

          window.socket.on('move', function(data){
            var ship = _.find(that.ships, function(ship){
              return ship.model.get('jugador_id') == data.jugador_id
            });

            ship.leftVector.reset(data.coordenadas);
          });

          window.socket.on('shoot', function(data){
            that.makeBullet(data);
          });

          window.socket.on('jugadorDesconectado', function(data){
            _.each(that.ships, function(ship, index){
              if(ship.model.get('jugador_id') == data.jugador_id){
                that.ships.splice(index, 1);
                ship.canvas.remove();
                ship.remove();
              }
            });

            var jugador = that.jugadores.findWhere({id: data.jugador_id});
            if(jugador) that.jugadores.remove(jugador);
          });

          setInterval(this.draw, 1000/60);
        },
        resetCanvas: function(event){
          //BUG: al dar vuelta la pantalla this no es esta vista sino window

          // resize the canvas - but remember - this clears the canvas too.
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerHeight;

          this.model.set({
            halfWidth: parseInt(this.canvas.width/2),
            halfHeight: parseInt(this.canvas.height/2)
          });

          //make sure we scroll to the top left.
          window.scrollTo(0,0);

          this.context.strokeStyle = "#ffffff";
          this.context.lineWidth = 2;
        },
        draw: function(){
          var that = window.router.screenView;
          that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);

          that.drawScoreboard();

          that.drawShips();

          that.drawBullets();
        },
        drawScoreboard: function(){
          this.context.font = '15pt sans-serif';
          this.context.lineWidth = 1;
          this.context.strokeStyle = 'red';

          var that = this;
          var heightPos = 20;

          that.context.strokeText('Jugadores', 20, 20);

          this.jugadores.each(function(jugador){
            heightPos+=20;
            that.context.fillStyle = jugador.get("color");
            that.context.fillText(jugador.get("nombre"), 20, heightPos);
          });
        },
        drawShips: function(){
          var that = this;

          _.each(this.ships, function(ship){
            ship.update();

            if(ship.pos.get('x') < 0)
                ship.pos.set({x: that.canvas.width});
            else if(ship.pos.get('x') > that.canvas.width)
                ship.pos.set({x: 0});

            if(ship.pos.get('y') < 0)
                ship.pos.set({y: that.canvas.height});
            else if (ship.pos.get('y') > that.canvas.height)
                ship.pos.set({y: 0});

            ship.draw();
          })
        },
        drawBullets: function(){
          for (var i = 0; i < this.bullets.length; i++) {
            var bullet = this.bullets[i];

            if(!bullet.model.get('enabled')) continue;

            bullet.update();
            //si la posicion esta dentro del rango de la nave
            //no tendria que dibujarla y tendria que destruir la nave
            //cuando la nave se destruye aumentar contador y volver a respawnear

            bullet.draw(this.context);

            if(!bullet.model.get('enabled'))
              this.spareBullets.push(bullet);
          }
        },
        makeBullet: function(data){
          var bullet;

          var ship = _.find(this.ships, function(ship){
            return ship.model.get('jugador_id') == data.jugador_id
          });

          if(this.spareBullets.length>0) {
              bullet = this.spareBullets.pop();

              bullet.reset({
                  x: ship.pos.get('x'),
                  y: ship.pos.get('y'),
                  angle: ship.model.get('angle')
              });
          } else {
              bullet = new BulletView({
                  x: ship.pos.get('x'),
                  y: ship.pos.get('y'),
                  angle: ship.model.get('angle')
              });

              this.bullets.push(bullet);
          }

          bullet.vel.plusEq(ship.vel);
      }


    });

    return ScreenView;
});
