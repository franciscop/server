// Log plugin
const morgan = require('morgan');
const plugin = {
  name: 'log',
  options: { level: 'debug' },
  init: ctx => ctx.log = ((...args) => console.log(...args))
};

module.exports = plugin;
