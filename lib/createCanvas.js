module.exports = createCanvas;

function createCanvas(settings, domContainer) {
  if (settings.canvas) {
    return settings.canvas;
  }
  if (typeof document !== 'undefined') {
    // we are in the browser:
    return createDomCanvas(settings, domContainer);
  }

  return createNodeCanvas(settings);
}

var lastDomId = 0;

function createDomCanvas(settings, domContainer) {
  if (typeof settings.canvasId === 'string') {
    // if user already has a DOM canvas element, use it:
    return createDomCanvasWithId(settings.canvasId);
  }

  // Otherwise create new and append it to DOM container:
  var canvas = document.createElement('canvas');
  canvas.id = 'ngraph_fabric_' + (lastDomId++);
  canvas.width = domContainer.clientWidth;
  canvas.height = domContainer.clientHeight;
  domContainer.appendChild(canvas);

  return createDomCanvasWithId(canvas.id);
}

function createDomCanvasWithId(id) {
  return new fabric.StaticCanvas(id, {
    renderOnAddRemove: false
  });
}

function createNodeCanvas (settings) {
  var fabric = require('./fabric'),
  nodeCanvas = require("canvas");

  var createCanvas = nodeCanvas.createCanvas;
  var Canvas = nodeCanvas.Canvas;

  var canvasEl = fabric.document.createElement("canvas"),
    nodeCanvas = createCanvas(settings.width || 600, settings.height || 600);

   canvasEl.style = { };

   canvasEl.width = nodeCanvas.width;
   canvasEl.height = nodeCanvas.height;

   var FabricCanvas = fabric.StaticCanvas;
   var fabricCanvas = new FabricCanvas(canvasEl, {
     renderOnAddRemove: false
   });

   fabricCanvas.contextContainer = nodeCanvas.getContext('2d');
   fabricCanvas.nodeCanvas = nodeCanvas;
   fabricCanvas.Font = Canvas.Font;

   return fabricCanvas;
}
