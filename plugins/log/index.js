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
  options: {
    __root: 'level',
    level: {
      default: 'info',
      type: String,
      enum: valid
    },
    report: {
      default: process.stdout
    }
  },
  init: ctx => {
    if (ctx.options.log && ctx.options.log.report) {
      ctx.log = new Log(ctx.options.log, ctx.options.log.report);
      return;
    }

    ctx.log = new Log(ctx.options.log);
  }
};

module.exports = plugin;
