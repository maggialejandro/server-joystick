define(["backbone"], function(Backbone) {

    var JugadorModel = Backbone.Model.extend({
      defaults: {
        nombre: "Player "
      },
      getDefaultName: function(){
        return this.get('nombre') + this.get('id')
      }

    });

    return JugadorModel;
});
