const log = require('npmlog');

const valid = [
  'debug',
  'info',
  'notice',
  'warning',
  'error',
  'critical',
  'alert',
  'emergency'
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
    valid.forEach((level, n) => {
      log.addLevel(level, n);
    });
    log.level = 'info';
    if (ctx.options.log.level) {
      log.level = ctx.options.log.level;
    }
    ctx.log = {};
    valid.forEach(type => {
      ctx.log[type] = content => {
        if (
          ctx.options.log.report &&
          typeof ctx.options.log.report === 'function'
        ) {
          ctx.options.log.report(content, type);
        }
        log.log(type, '', content);
      };
    });
  }
};

module.exports = plugin;
