var test = require('tap').test,
    createGraph = require('ngraph.generators'),
    createGraphics = require('../');

test('It has defaults', function (t) {
  var graph = createGraph.grid(2, 2);
  var graphics = createGraphics(graph);

  t.ok(graphics.layout, 'Has layout');
  t.ok(graphics.canvas, 'Has canvas');
  t.end();
});

test('It has defaults', function (t) {
  var graph = createGraph.grid(2, 2);
  var graphics = createGraphics(graph);

  var transforms = graphics.getTransform();

  t.equal(transforms.scale, 1, 'Not scaled by default');
  t.equal(transforms.dx, graphics.canvas.width/2, 'Moved to canvas center');
  t.equal(transforms.dy, graphics.canvas.height/2, 'Moved to canvas center');

  t.end();
});
