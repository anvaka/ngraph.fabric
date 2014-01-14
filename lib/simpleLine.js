var fabric = require('./fabric');

module.exports = fabric.util.createClass(fabric.Object, {
    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'simpleline',

    /**
     * Constructor
     * @param {Array} [points] Array of points
     * @param {Object} [options] Options object
     * @return {fabric.Line} thisArg
     */
    initialize: function(points, options) {
      options = options || { };

      if (!points) {
        points = [0, 0, 0, 0];
      }

      this.callSuper('initialize', options);

      this.x1 = points[0];
      this.y1 = points[1];
      this.x2 = points[2];
      this.y2 = points[3];
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    render: function(ctx) {
      ctx.beginPath();

      ctx.moveTo(this.x1, this.y1);

      ctx.lineTo(this.x2, this.y2);
      ctx.lineWidth = this.strokeWidth;

      var origStrokeStyle = ctx.strokeStyle;
      ctx.strokeStyle = this.stroke || ctx.fillStyle;
      ctx.stroke();
      ctx.strokeStyle = origStrokeStyle;
    },


    /**
     * Returns complexity of an instance
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });
