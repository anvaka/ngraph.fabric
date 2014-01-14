module.exports.main = function () {
  var graph = require('ngraph.generators').grid(10, 10);
  var createFabric = require('../../');
  var fabricGraphics = createFabric(graph);
  var canvas = fabricGraphics.canvas;
  var heyThere;
  var sprite = require('./sprite');

  sprite.fromURL('assets/sprite.png', function (sprite){
    heyThere = sprite;
  });

  var isPlaying;

  fabricGraphics.on('mouseOverNode', function (node) {
    if (!heyThere) return;

    var ui = fabricGraphics.getNodeUI(node.id);
    canvas.add(heyThere);
    heyThere.set({
      left: ui.left - 20,
      top: ui.top - 50
    });
    heyThere.play();
    isPlaying = true;
  }).on('mouseLeaveNode', function (node) {
    if (!isPlaying) return;
    heyThere.stop();
    canvas.remove(heyThere);
  })
  // begin animation loop:
  fabricGraphics.run();
}
