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

test('Transform', function (t) {
  var graph = createGraph.grid(2, 2);
  t.test('initialized', function (t) {
    var graphics = createGraphics(graph);
    var transforms = graphics.getTransform();

    t.equal(transforms.scale, 1, 'Not scaled by default');
    t.equal(transforms.dx, graphics.canvas.width/2, 'Moved to canvas center');
    t.equal(transforms.dy, graphics.canvas.height/2, 'Moved to canvas center');
    t.end();
  });

  t.test('getLocalCoordinates', function (t) {
    var graphics = createGraphics(graph);
    var transforms = graphics.getTransform();

    // Graphics makes sure position (0, 0) is always in the middle of the canvas:
    var width = graphics.canvas.width;
    var height = graphics.canvas.height;
    var local = graphics.getLocalPosition(width/2, height/2);
    t.equal(local.x, 0, 'X at 0');
    t.equal(local.y, 0, 'Y at 0');

    // now let's scale into center of a canvas:
    graphics.zoom(0, 0, 2);

    // since we scaled to center of a canvas, it should still return 0, 0:
    var scaled = graphics.getLocalPosition(width/2, height/2);
    t.equal(scaled.x, 0, 'X at 0');
    t.equal(scaled.y, 0, 'Y at 0');

    var topLeft = graphics.getLocalPosition(0, 0);
    // we scaled by factor of two into middle of the canvas, everything become
    // bigger, and top left was moved way out of visible area, so it should be
    // twice as small as original position:
    t.equal(topLeft.x, -width/4, 'Left has moved proportionally');
    t.equal(topLeft.y, -height/4, 'Top has moved proportionally');

    // let's make sure any scale point remains invariant:
    var cx = 10; cy = 42; // just an arbitrary point;
    var transformCenter = graphics.getLocalPosition(cx, cy);
    graphics.zoom(transformCenter.x, transformCenter.y, 2); // zoom on it
    var afterZoom = graphics.getLocalPosition(cx, cy);
    // since we zoomed to the same point its local coordinates should be intact
    t.equal(transformCenter.x, afterZoom.x, "Transform preserves invariant");
    t.equal(transformCenter.y, afterZoom.y, "Transform preserves invariant");
    t.end();
  });
  t.end();
});
