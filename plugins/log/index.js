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
    },
    instance: {
      type: Object,
      validate(value) {
        if (!value) {
          return true;
        }
        const expectedMethods = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'];
        const missingMethods = expectedMethods.filter(name => typeof value[name] !== 'function');
        return missingMethods.length === 0 || new Error(
          `Missing log.instance method${missingMethods.length > 1 ? 's': ''}: ${missingMethods.join(', ')}`
        );
      }
    }
  },
  init: ctx => {
    ctx.log = ctx.options.log.instance || new Log(ctx.options.log.level, ctx.options.log.report);
  }
};

module.exports = plugin;
