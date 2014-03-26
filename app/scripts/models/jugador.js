define(["backbone"], function(Backbone) {

    var JugadorModel = Backbone.Model.extend({
      defaults: {
        nombre: "Player ",
        score: 0
      },
      getDefaultName: function(){
        return this.get('nombre') + this.get('id')
      },
      sumarHit: function(){
        this.set({score: this.get('score')+1})
      },
      restarHit: function(){
        this.set({score: this.get('score')-1})
      }

    });

    return JugadorModel;
});
