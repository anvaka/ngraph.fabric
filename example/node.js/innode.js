// This simple file will render graph into an image
  var graph = require('ngraph.generators').grid(40, 40);

  // we are going to use our own layout:
  var layout = require('ngraph.forcelayout')(graph);
  console.log('Running layout...');
  for (var i = 0; i < 500; ++i) {
    layout.step();
  }
  console.log('Done. Rendering graph...');

  var createFabric = require('../../');
  var graphRect = layout.getGraphRect();
  var size = Math.max(graphRect.x2 - graphRect.x1, graphRect.y2 - graphRect.y1) + 100;
  var fabricGraphics = createFabric(graph, {
    width: size,
    height: size,
    layout: layout
  });

  var fabric = require('fabric').fabric;
  fabricGraphics.createNodeUI(function (node) {
    return new fabric.Circle({ radius: Math.random() * 20, fill: 'gray' });
  }).renderNode(function (circle) {
    circle.left = circle.pos.x - circle.radius;
    circle.top = circle.pos.y - circle.radius;
  });
  var scale = 1;

  fabricGraphics.setTransform(size/2, size/2, scale);
  fabricGraphics.renderOneFrame();

  console.log('Done. Saving to file');

  var fs = require('fs');
  var out = fs.createWriteStream(__dirname + '/helloworld.png');
  var canvas = fabricGraphics.canvas;
  var stream = canvas.createPNGStream();
  stream.on('data', function(chunk) {
    out.write(chunk);
  });
