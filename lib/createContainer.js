module.exports = function (settings) {
  // otherwise let's create a canvas and add it to the dom:
  if (typeof document !== 'undefined') {
    return settings.container || document.body;
  }
}

