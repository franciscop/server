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
    ctx.log = new Log(ctx.options.log.level, ctx.options.log.report);
  }
};

module.exports = plugin;
