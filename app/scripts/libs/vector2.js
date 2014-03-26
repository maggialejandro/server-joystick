define(["backbone"], function(Backbone) {

  var Vector2 = Backbone.Model.extend({
    defaults: {
      x: 0,
      y: 0,
      TO_DEGREES: 180 / Math.PI,
      TO_RADIANS: Math.PI / 180,
    },
    initialize: function(coordenadas){
      if(coordenadas)
        this.reset(coordenadas);
      else
        this.reset({x: 0, y: 0});
    },
    reset: function(coordenadas){
      this.set(coordenadas);
    },
    toString: function(decPlaces){
      decPlaces = decPlaces || 3;
      var scalar = Math.pow(10,decPlaces);
      return "[" + Math.round (this.get('x') * scalar) / scalar + ", " + Math.round (this.get('y') * scalar) / scalar + "]";
    },
    magnitude: function(){
      return Math.sqrt((this.get('x') * this.get('x')) + (this.get('y') * this.get('y')));
    },
    magnitudeSquared : function () {
      return (this.get('x')*this.get('x'))+(this.get('y')*this.get('y'));
    },
    normalise : function () {
      var m = this.magnitude();
      this.reset({x: this.get('x')/m, y: this.get('y')/m});
    },
    reverse: function(){
      this.reset({x: -this.get('x'), y: -this.get('y')});
    },
    multiplyEq: function(scalar){
      this.reset({x: this.get('x')*scalar, y: this.get('y')*scalar});
    },
    divideEq: function (scalar) {
      this.reset({x: this.get('x')/=scalar, y: this.get('y')/=scalar});
    },
    angle: function (useRadians) {
      return Math.atan2(this.get('y'),this.get('x')) * (useRadians ? 1 : this.get('TO_DEGREES'));
    },
    clone: function () {
      return new Vector2({x: this.get('x'), y: this.get('y')});
    },
    copyTo: function (v) {
      v.reset({x: this.get('x'), y: this.get('y')});
    },
    copyFrom: function (v) {
      this.reset({x: v.get('x'), y: v.get('y')});
    },
    plusEq: function (v) {
      this.reset({x: this.get('x')+v.get('x'), y: this.get('y')+v.get('y')});
    },
    plusNew: function (v) {
      return new Vector2({x: this.get('x')+v.get('x'), y: this.get('y')+v.get('y')});
    },
    minusEq: function (v) {
      this.reset({x: this.get('x')-v.get('x'), y: this.get('y')-v.get('y')});
    },
    minusNew: function (v) {
      return new Vector2({x: this.get('x')-v.get('x'), y: this.get('y')-v.get('y')});
    },
    rotate: function (angle, useRadians) {
      var cosRY = Math.cos(angle * (useRadians ? 1 : this.get('TO_RADIANS')));
      var sinRY = Math.sin(angle * (useRadians ? 1 : this.get('TO_RADIANS')));

      window.tempVector.copyFrom(this);

      this.set({
        x: (window.tempVector.get('x')*cosRY)-(window.tempVector.get('y')*sinRY),
        y: (window.tempVector.get('x')*sinRY)+(window.tempVector.get('y')*cosRY)
      });

      return this;
    },
    equals: function (v) {
      return((this.get('x')==v.get('x'))&&(this.get('y')==v.get('x'))); //v.x?
    },
    isCloseTo: function (v, tolerance) {
      if(this.equals(v)) return true;

      window.tempVector.copyFrom(this);
      window.tempVector.minusEq(v);

      return(window.tempVector.magnitudeSquared() < tolerance*tolerance);
    },
    rotateAroundPoint: function (point, angle, useRadians) {
      window.tempVector.copyFrom(this);
      //trace("rotate around point "+t+" "+point+" " +angle);
      window.tempVector.minusEq(point);
      //trace("after subtract "+t);
      window.tempVector.rotate(angle, useRadians);
      //trace("after rotate "+t);
      window.tempVector.plusEq(point);
      //trace("after add "+t);
      this.copyFrom(window.tempVector);
    },
    isMagLessThan: function (distance) {
      return(this.magnitudeSquared()<distance*distance);
    },
    isMagGreaterThan: function (distance) {
      return(this.magnitudeSquared()>distance*distance);
    }

  });

return Vector2;
});
