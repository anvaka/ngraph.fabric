if (typeof window === 'undefined') {
  var fabric = require('fabric');
  module.exports =  fabric.fabric;
} else {
  module.exports = window.fabric;
}
