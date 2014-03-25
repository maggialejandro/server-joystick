define(["backbone", "models/jugador"], function(Backbone, JugadorModel) {

    var JugadoresList = Backbone.Collection.extend({
      model: JugadorModel
    });

    return JugadoresList;
});
