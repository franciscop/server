const Log = require('log');

const valid = [
  'emergency',
  'alert',
  'critical',
  'error',
  'warning',
  'notice',
  'info',
  'debug'
];

// Log plugin
const plugin = {
  name: 'log',
  options: 'debug',
  init: ctx => {
    if (!valid.includes(ctx.options.log)) {
      throw new Error(`The log level ${ctx.options.log} is not valid. Valid names: ${valid}`);
    }
    ctx.log = new Log(ctx.options.log);
  }
};

module.exports = plugin;
