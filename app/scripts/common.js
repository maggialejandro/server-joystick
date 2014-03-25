//The build will inline common dependencies into this file.

requirejs.config({
  shim : {
    'underscore': {
      'exports': '_'
    },
    'backbone' : {
      'deps' : ['underscore', 'jquery'],
      'exports' : 'Backbone'
    },
    'bootstrap' : {
      'deps' : ['jquery']
    }
  },
  paths: {
    'jquery' : '../bower_components/jquery/dist/jquery',
    'underscore' : '../bower_components/underscore/underscore',
    'backbone' : '../bower_components/backbone/backbone',
    'bootstrap' : '../bower_components/dist/js/bootstrap',
    'text': 'libs/text',
    "vector2" : "libs/vector2",
    "socketio" : "libs/socket-io",
    "ratchet" : "libs/ratchet"
  }
});
