module.exports.main = function () {
  var graph = require('ngraph.generators').grid(10, 10);
  var createFabric = require('../../');
  var fabricGraphics = createFabric(graph);

  fabricGraphics.createNodeUI(function (node) {
    return new fabric.Circle({ radius: Math.random() * 20, fill: getNiceColor() });
  }).renderNode(function (circle) {
    circle.left = circle.pos.x - circle.radius;
    circle.top = circle.pos.y - circle.radius;
  }).createLinkUI(function (link) {
    // lines in fabric are odd... Maybe I don't understand them.
    return new fabric.Line([0, 0, 0, 0], {
      stroke: getNiceColor(),
      originX: 'center',
      originY: 'center'
    });
  }).renderLink(function (line) {
    line.set({
      x1: line.from.x,
      y1: line.from.y,
      x2: line.to.x,
      y2: line.to.y
    });
  });

  // begin animation loop:
  fabricGraphics.run();
}

var niceColors = [
 '#1f77b4', '#aec7e8',
 '#ff7f0e', '#ffbb78',
 '#2ca02c', '#98df8a',
 '#d62728', '#ff9896',
 '#9467bd', '#c5b0d5',
 '#8c564b', '#c49c94',
 '#e377c2', '#f7b6d2',
 '#7f7f7f', '#c7c7c7',
 '#bcbd22', '#dbdb8d',
 '#17becf', '#9edae5'
];

function getNiceColor() {
  return niceColors[(Math.random() * niceColors.length)|0];
}
