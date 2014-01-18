'use strict';
if (typeof window === 'undefined') {
  var m = require('module');
  var fs = require('fs');
  var original = m.Module._extensions['.js'];
m.Module._extensions['.js'] = function (module, fileName) {
  if (fileName.indexOf('fabric.js') > 0) {
    console.log('ninja log:' + fileName);
    var content = fs.readFileSync(fileName, 'utf8');
    console.log('ninja content: ' + content);
  }
  original.apply(this, arguments);
}
  var fabric = require('fabric');
  module.exports =  fabric.fabric;
} else {
  module.exports = window.fabric;
}
