# ngraph.fabric

This is a 2d graph renderer, which uses [Fabric.js](https://github.com/kangax/fabric.js) as a rendering engine.
[![rendered from node.js](example/node.js/outGraph.png)](http://anvaka.github.io/ngraph.fabric/example/customUI/)

NB: Image above was [rendered from Node.js](https://github.com/anvaka/ngraph.fabric/blob/master/example/node.js/innode.js). Click on the image to see interactive version rendered by the same code in your browser.

# Example
This code will render interactive graph:

``` js
  // let's create a simple graph with two nodes, connected by edge:
  var graph = require('ngraph.graph')();
  graph.addLink(1, 2);

  // Create a fabric renderer:
  var fabricGraphics = require('ngraph.fabric')(graph);

  // And launch animation loop:
  fabricGraphics.run();
```

Use mouse wheel to zoom in/zoom out, drag canvas/nodes with left mouse button. More examples are available in the `exmples` folder. You can also play with browserified examples here:

* [Default UI rendering](http://anvaka.github.io/ngraph.fabric/example/basic/)
* [Custom look and feel for nodes and links](http://anvaka.github.io/ngraph.fabric/example/customUI/)
* [Add/remove graph's elements dynamically](http://anvaka.github.io/ngraph.fabric/example/dynamic/)
* [Hover mouse over a node to get a wave](http://anvaka.github.io/ngraph.fabric/example/interactive/)

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.fabric
```

# license

MIT
