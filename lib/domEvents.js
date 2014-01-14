module.exports = function(domContainer) {
  var addWheelListner = require('wheel'),
      events = require('ngraph.events'),
      emitter = events({});

  if (domContainer) {
    addWheelListner(domContainer, function(e){
      emitter.fire('wheel', e);
    });
  }

  return emitter;
}
