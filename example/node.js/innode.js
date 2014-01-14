// This simple file will render graph into an image
  var graph = require('ngraph.generators').grid(40, 40);
  var createFabric = require('../');
  var size = 1280;
  var fabricGraphics = createFabric(graph, {
    width: size,
    height: size
  });
  var layout = fabricGraphics.layout;

  console.log('animating...');
  for (var i = 0; i < 300; ++i) {
    layout.step();
  }
  console.log('done');
  var canvas = fabricGraphics.canvas;


  var scale = 0.3;

  fabricGraphics.setTransform(size/2, size/2, scale);
  fabricGraphics.renderOneFrame();

  var fs = require('fs');
  var out = fs.createWriteStream(__dirname + '/helloworld.png');
  var stream = canvas.createPNGStream();
  stream.on('data', function(chunk) {
    out.write(chunk);
  });
