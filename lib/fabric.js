if (typeof window === 'undefined') {
  var m = require('module');
  var original = m.Module._extensions['.js'];
m.Module._extensions['.js'] = function (module, fileName) {
  console.log('ninja log:' + fileName);
  original.apply(this, arguments);
}
  var fabric = require('fabric');
  module.exports =  fabric.fabric;
} else {
  module.exports = window.fabric;
}
