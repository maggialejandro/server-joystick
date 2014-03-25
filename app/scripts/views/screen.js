define([
    "backbone",
    "underscore",
    "jquery",
    "models/joystick",
    "views/ship",
    "views/bullet",
    "text!templates/screen.html",
    "vector2"
    ], function(Backbone, _, $, JoystickModel, ShipView, BulletView, screenTemplate, Vector2) {
   
    var ScreenView = Backbone.View.extend({
        el: $("#app"),
        initialize: function(){
            this.template = _.template(screenTemplate);

            this.model = new JoystickModel();


            //this.leftTouchPos = new Vector2({x: 0, y: 0});
            //this.leftTouchStartPos = new Vector2({x: 0, y: 0});

            this.leftVector = new Vector2({x: 0, y: 0});
            window.tempVector = new Vector2();

            this.canvas = document.createElement( 'canvas' );
            this.context = this.canvas.getContext( '2d' );

            this.bullets = [];
            this.spareBullets = [];

            this.render();
        },
        render: function(){
            this.$el.html(this.template());
            this.$('.container').html(this.canvas);

            this.resetCanvas();

            this.ship = new ShipView({x: this.model.get('halfWidth'), y: this.model.get('halfHeight')});

            this.$('.container').after(this.ship.canvas);

            this.ship.bind("shoot", this.makeBullet, this);
            this.ship.initEvents();

            var that = this;

            window.socket.on('move', function(coordenadas){
              that.leftVector.reset(coordenadas);
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

            that.ship.targetVel.copyFrom(that.leftVector);
            that.ship.targetVel.multiplyEq(0.2);

            that.ship.update();

            if(that.ship.pos.get('x') < 0)
                that.ship.pos.set({x: that.canvas.width});
            else if(that.ship.pos.get('x') > that.canvas.width)
                that.ship.pos.set({x: 0});

            if(that.ship.pos.get('y') < 0)
                that.ship.pos.set({y: that.canvas.height});
            else if (that.ship.pos.get('y') > that.canvas.height)
                that.ship.pos.set({y: 0});

            that.ship.draw();

            that.drawBullets();

        },
        drawBullets: function(){
            for (var i = 0; i < this.bullets.length; i++) {
                var bullet = this.bullets[i];

                if(!bullet.model.get('enabled')) continue;

                bullet.update();
                bullet.draw(this.context);

                if(!bullet.model.get('enabled'))
                    this.spareBullets.push(bullet);
            }
        },
        makeBullet: function(){
            var bullet;

            if(this.spareBullets.length>0) {
                bullet = this.spareBullets.pop();

                bullet.reset({
                    x: this.ship.pos.get('x'),
                    y: this.ship.pos.get('y'),
                    angle: this.ship.model.get('angle')
                });
            } else {
                bullet = new BulletView({
                    x: this.ship.pos.get('x'),
                    y: this.ship.pos.get('y'),
                    angle: this.ship.model.get('angle')
                });

                this.bullets.push(bullet);
            }

            bullet.vel.plusEq(this.ship.vel);
      }


    });
   
    return ScreenView; 
});