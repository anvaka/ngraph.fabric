/**
 * This module provides default settings for fabric graphics. There are a lot
 * of possible configuration paramters, and this file provides reasonable defaults
 */

/**
 * Default node UI creator. Renders a square
 */
module.exports.createNodeUI = createNodeUI;

/**
 * Default link UI creator. Returns SimpleLine, since fabric.Line is way too
 * heavy for what we need
 */
module.exports.createLinkUI = createLinkUI;

/**
 * Updates rectangle position
 */
module.exports.nodeRenderer = nodeRenderer;

/**
 * Updates SimpleLine position
 */
module.exports.linkRenderer = linkRenderer;

var NODE_SIZE = 10; // default size of a node square

var fabric = require('./fabric');
var SimpleLine = require('./simpleLine');

function createNodeUI(node) {
  return new fabric.Rect({
              fill: '#0033DD',
              width: NODE_SIZE,
              height: NODE_SIZE
            });
}

function createLinkUI(link) {
  return new SimpleLine([0, 0, 0, 0], {
    stroke: '#cccccc',
    strokeWidth: 1
  });
}

function nodeRenderer(node) {
  node.left = node.pos.x - NODE_SIZE/2;
  node.top = node.pos.y - NODE_SIZE/2;
}

function linkRenderer(link) {
  link.x1 = link.from.x;
  link.y1 = link.from.y;
  link.x2 = link.to.x;
  link.y2 = link.to.y;
}
