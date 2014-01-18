module.exports = function (graph, settings){
  var merge = require('ngraph.merge');
  var fabric = require('./lib/fabric');

  settings = merge(settings, {
    // canvasId: "id", // identifier of dom element which sould be used as a container
    // container: DomElement, // DOM element where you want to attach generated canvas
    // Default physics engine settings
      physics: {
        springLength: 30,
        springCoeff: 0.0008,
        dragCoeff: 0.01,
        gravity: -1.2,
        theta: 1
      },
      // default canvas size when rendering from node
      width: 640,
      height: 480
  });

  var defaults = require('./lib/defaults');
  var domContainer = require('./lib/createContainer')(settings);
  var canvas = require('./lib/createCanvas')(settings, domContainer);

  var layout = createLayout(settings); // Our layout algorithm

  var dx, dy, scale; // Global canvas transforms

  // Default callbacks to build/render nodes and links
  var nodeUIBuilder, nodeRenderer, linkUIBuilder, linkRenderer;

  var nodeUI, linkUI; // Storage for UI of nodes/links
  var getNodeAt; // node lookup by cooridnates

  // Public API:
  var graphics = {
    run : animationLoop,
    renderOneFrame: renderOneFrame,
    canvas: canvas,
    layout: layout,

    /**
     * Sets absolute transform for a canvas
     * @param {Number} tx - X translate
     * @param {Number} ty - Y translate
     * @param {Number} newScale - Scale level
     */
    setTransform: function(tx, ty, newScale) {
      scale = newScale; dx = tx; dy = ty;
      canvas.contextContainer.setTransform(scale, 0, 0, scale, dx, dy);
    },

    /**
     * Gets current transforms applied to canvas
     */
    getTransform: function () {
      return {
        scale: scale,
        dx: dx,
        dy: dy
      };
    },

    /**
     * Zooms to a point cx, cy (in canvas coordinates) with given scale level
     */
    zoom: function (cx, cy, newScale) {
      var ds = (scale - newScale);
      graphics.setTransform(dx + cx * ds, dy + cy * ds, newScale);
    },

    /**
     * Gets canvas position from world position (e.g. mouse cursor)
     * @param {Number} x - coordinate X relative to top left corner of a canvas
     * @param {Number} y - coordinate Y relative to top left corner of a canvas
     */
    getLocalPosition: getLocalPosition,

    /**
     * Resets all transforms and center graph
     */
    resetTransform: function () {
      graphics.setTransform(canvas.width/2, canvas.height/2, 1);
    },

    /**
     * Gets UI object for a given node id
     */
    getNodeUI : function (nodeId) {
      return nodeUI[nodeId];
    },

    getLinkUI: function (linkId) {
      return linkUI[linkId];
    },

    /**
     * This callback creates new UI for a graph node. This becomes helpful
     * when you want to precalculate some properties, which otherwise could be
     * expensive during rendering frame.
     *
     * @callback createNodeUICallback
     * @param {object} node - graph node for which UI is required.
     * @returns {object} arbitrary object which will be later passed to renderNode
     */
    /**
     * This function allows clients to pass custon node UI creation callback
     * 
     * @param {createNodeUICallback} createNodeUICallback - The callback that 
     * creates new node UI
     * @returns {object} this for chaining.
     */
    createNodeUI : function (createNodeUICallback) {
      nodeUI = {};
      nodeUIBuilder = createNodeUICallback;
      getNodeAt = require('./lib/spatialIndex')(graph, nodeUI);
      rebuildUI();
      return this;
    },

    /**
     * This callback is called by graphics when it wants to render node on
     * a screen.
     *
     * @callback renderNodeCallback
     * @param {object} node - result of createNodeUICallback(). It contains anything
     * you'd need to render a node
     */
    /**
     * Allows clients to pass custom node rendering callback
     *
     * @param {renderNodeCallback} renderNodeCallback - Callback which renders
     * node.
     *
     * @returns {object} this for chaining.
     */
    renderNode: function (renderNodeCallback) {
      nodeRenderer = renderNodeCallback;
      return this;
    },

    /**
     * This callback creates new UI for a graph link. This becomes helpful
     * when you want to precalculate some properties, which otherwise could be
     * expensive during rendering frame.
     *
     * @callback createLinkUICallback
     * @param {object} link - graph link for which UI is required.
     * @returns {object} arbitrary object which will be later passed to renderNode
     */
    /**
     * This function allows clients to pass custon node UI creation callback
     * 
     * @param {createLinkUICallback} createLinkUICallback - The callback that
     * creates new link UI
     * @returns {object} this for chaining.
     */
    createLinkUI : function (createLinkUICallback) {
      linkUI = {};
      linkUIBuilder = createLinkUICallback;
      rebuildUI();
      return this;
    },

    /**
     * This callback is called by graphics when it wants to render link on
     * a screen.
     *
     * @callback renderLinkCallback
     * @param {object} link - result of createLinkUICallback(). It contains anything
     * you'd need to render a link
     */
    /**
     * Allows clients to pass custom link rendering callback
     *
     * @param {renderLinkCallback} renderLinkCallback - Callback which renders
     * link.
     *
     * @returns {object} this for chaining.
     */
    renderLink: function (renderLinkCallback) {
      linkRenderer = renderLinkCallback;
      return this;
    }
  };

  // teach graphics object to fire events
  require('ngraph.events')(graphics);

  // Make sure everything is initialized before returning API:
  initialize();

  return graphics;

///////////////////////////////////////////////////////////////////////////////

  function initialize() {
    nodeUIBuilder = defaults.createNodeUI,
    nodeRenderer  = defaults.nodeRenderer,
    linkUIBuilder = defaults.createLinkUI,
    linkRenderer  = defaults.linkRenderer;
    nodeUI = {}, linkUI = {}; // Storage for UI of nodes/links

    getNodeAt = require('./lib/spatialIndex')(graph, nodeUI);

    graph.forEachLink(initLink);
    graph.forEachNode(initNode);

    graph.on('changed', onGraphChanged);

    graphics.resetTransform();
    listenToInputEvents(domContainer);
  }

  function animationLoop() {
    layout.step();
    renderOneFrame();
    fabric.util.requestAnimFrame(animationLoop, canvas.getElement());
  }

  function renderOneFrame() {
    Object.keys(linkUI).forEach(renderLink);
    Object.keys(nodeUI).forEach(renderNode);

    // Fabric does not repsect transforms when it clears context; Doing it ourselves:
    clearContext(canvas.contextContainer);
    canvas.renderAll();
  }

  function clearContext(ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.clearContext(ctx);
    ctx.restore();
  }

  function renderNode(nodeId) {
    nodeRenderer(nodeUI[nodeId]);
  }

  function renderLink(linkId) {
    linkRenderer(linkUI[linkId]);
  }

  function initNode(node) {
    var ui = nodeUIBuilder(node);
    if (!ui) return;
    // augment it with position data:
    ui.pos = layout.getNodePosition(node.id);
    // and store for subsequent use:
    nodeUI[node.id] = ui;

    canvas.add(ui);
  }

  function initLink(link) {
    var ui = linkUIBuilder(link);
    if (!ui) return;

    ui.from = layout.getNodePosition(link.fromId);
    ui.to = layout.getNodePosition(link.toId);

    linkUI[link.id] = ui;
    canvas.insertAt(ui, 0);
  }

  function rebuildUI() {
    // fabric does not have fast method to clear scene. This is a dirty hack:
    canvas.getObjects().length = 0;
    graph.forEachLink(initLink);
    graph.forEachNode(initNode);
  }

  function listenToInputEvents(container) {
    var domEvents = require('./lib/domEvents')(container);

    domEvents.on('wheel', handleMouseWheel)
      .on('mousedown', handleMouseDown)
      .on('mouseup', handleMouseUp)
      .on('mousemove', handleMouseMove);

    var isDragging = false,
        prevX, prevY,
        lastOver, nodeUnderCursor;

    function handleMouseDown(e) {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;

      var pos = getLocalPosition(e.clientX, e.clientY);
      nodeUnderCursor = getNodeAt(pos.x, pos.y);
      if (nodeUnderCursor) {
        layout.pinNode(nodeUnderCursor, true);
        graphics.fire('mouseDownNode', nodeUnderCursor);
      }
    }

    function handleMouseUp(e) {
      isDragging = false;
      if (nodeUnderCursor) {
        layout.pinNode(nodeUnderCursor, false);
        graphics.fire('mouseUpNode', nodeUnderCursor);
      }
      nodeUnderCursor = null;
    }

    function handleMouseMove(e) {
      var pos = getLocalPosition(e.clientX, e.clientY);
      if (!isDragging) {
        var node  = getNodeAt(pos.x, pos.y);
        if (lastOver && lastOver != node) {
          graphics.fire('mouseLeaveNode', lastOver);
          lastOver = node;
          if (node) graphics.fire('mouseOverNode', node);
        } else if (node && !lastOver) {
          lastOver = node;
          graphics.fire('mouseOverNode', node);
        }
        return;
      }

      if (nodeUnderCursor) {
        layout.setNodePosition(nodeUnderCursor.id, pos.x, pos.y);
      } else {
        if (node) graphics.fire('mouseovernode', node);
        var offsetX = (e.clientX - prevX);
        var offsetY = (e.clientY - prevY);
        graphics.setTransform(dx + offsetX, dy + offsetY, scale);
        prevX = e.clientX;
        prevY = e.clientY;
      }
    }
  }

  function handleMouseWheel(e) {
    var isZoomIn = e.deltaY < 0;
    var direction = isZoomIn ? 1 : -1;
    var factor = (1 + direction * 0.1);
    var mousePos = {
      x: e.clientX,
      y: e.clientY
    };

    var before = getLocalPosition(mousePos.x, mousePos.y, scale);
    graphics.zoom(before.x, before.y, scale * factor);
  }

  function getLocalPosition(x, y, scaleLevel) {
    if (scaleLevel === undefined) {
      scaleLevel = scale; // use current scale then;
    }

    return {
      x: (x - dx) / scaleLevel,
      y: (y - dy) / scaleLevel
    };
  }

  function createLayout(settings) {
    if (settings.layout) {
      return settings.layout; // user has its own layout algorithm. Use it;
    }
    // otherwise let's create a default force directed layout:
    var physics = require('ngraph.physics.simulator');
    return require('ngraph.forcelayout')(graph, physics(settings.physics));
  }

  function onGraphChanged(changes) {
    for (var i = 0; i < changes.length; ++i) {
      var change = changes[i];
      if (change.changeType === 'add') {
        if (change.node) {
          initNode(change.node);
        }
        if (change.link) {
          initLink(change.link);
        }
      } else if (change.changeType === 'remove') {
        if (change.node) {
          var node = nodeUI[change.node.id];
          if (node) { canvas.remove(node); }
          delete nodeUI[change.node.id];
        }
        if (change.link) {
          var link = linkUI[change.link.id];
          if (link) canvas.remove(link);
          delete linkUI[change.link.id];
        }
      }
    }
  }
}
