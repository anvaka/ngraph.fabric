module.exports.main = function () {
  var graph = require('ngraph.generators').grid(10, 10);
  var createFabric = require('../../');
  var fabricGraphics = createFabric(graph);

  // this is a power of fabric. Shared ui settings can be used both on the
  // server side inside node.js application and in the browser. Checkout
  // `node.js` example to see how it's used inside node
  require('../shared/uiSettings')(fabricGraphics, fabric);

  // begin animation loop:
  fabricGraphics.run();
};
