// this is just a demo. To run it execute from the root of repository:
//
// > npm start
//
// Then open ./example/index.html
//
module.exports.main = function () {
  var graph = require('ngraph.generators').grid(10, 10);
  var createFabric = require('../');
  var fabricGraphics = createFabric(graph);

  // begin animation loop:
  fabricGraphics.run();
}
