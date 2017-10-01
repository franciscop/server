module.exports = async ctx => {

  const modern = ctx.utils.modern;
  const opts = ctx.options.core;

  // TODO: fix it so this is not needed
  const core = require('.');
  core.before = [];

  // Compress
  if (opts.compress) {
    const compress = require('compression')(opts.compress);
    core.before.push(modern(compress));
  }

  if (opts.timing) {
    const timing = require('response-time')(opts.timing);
    core.before.push(modern(timing));
  }

  if (opts.favicon) {
    const favicon = require('serve-favicon')(opts.favicon);
    core.before.push(modern(favicon));
  }

  if (opts.partials) {
    await new Promise((resolve, reject) => {
      const hbs = require('hbs');
      hbs.registerPartials(opts.partials, (err, done) => {
        return err ? reject(err) : resolve(done);
      });
    });
  }

  // Add a reference from ctx.req.body to the ctx.data and an alias
  core.before.push(ctx => {
    for (let key in ctx.req) {
      if (key !== 'host') {
        ctx[key] = ctx.req[key];
      }
    }
    ctx.data = ctx.body;
  });
};
