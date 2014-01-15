module.exports.main = function () {
  var graph = require('ngraph.graph')();
  var fabricGraphics = require('../../')(graph);

  require('./setCustomUI')(fabricGraphics);

  // begin graph modification (add/remove nodes):
  var graphChange = require('./animateGraph');
  graphChange.animate(graph);

  // begin rendering loop:
  fabricGraphics.run();
}
