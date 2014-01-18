module.exports = (typeof window === 'undefined') ? require('fabric').fabric : window.fabric;
