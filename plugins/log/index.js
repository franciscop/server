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
    level: 'info',
    report: process.stdout
  },
  init: ctx => {
    let opts = ctx.options.log;
    const level = typeof opts === 'string' ? opts : opts.level;
    // const report = typeof opts !== 'string' ? opts.report : process.stdout;
    if (!valid.includes(level)) {
      throw new Error(`The log level ${ctx.options.log} is not valid. Valid names: ${valid}`);
    }

    if (ctx.options.log && ctx.options.log.report) {
      ctx.log = new Log(ctx.options.log, ctx.options.log.report);
      return;
    }

    ctx.log = new Log(ctx.options.log);
  }
};

module.exports = plugin;
