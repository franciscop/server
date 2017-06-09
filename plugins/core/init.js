const path = require('path');

module.exports = ctx => {

  const modern = ctx.utils.modern;
  const opts = ctx.options.core;

  // TODO: fix it so this is not needed
  const core = require('.');
  core.before = [];

  // const core = ctx.plugins.filter(p => p.name === 'core')[0];
  // console.log(core.options);

  opts.public = opts.public || ctx.options.public;

  // Normalize the "public" folder
  if (!path.isAbsolute(opts.public)) {
    opts.public = path.join(process.cwd(), opts.public);
  }
  opts.public = path.normalize(opts.public);
  ctx.options.public = opts.public;

  // Compress
  if (opts.compress) {
    const compress = require('compression')(opts.compress);
    core.before.push(modern(compress));
  }

  // Public folder
  if (opts.public) {
    core.before.push(modern(ctx.express.static(opts.public)));
  }

  if (opts.session) {
    opts.session.secret = opts.session.secret || ctx.options.secret;
    const session = require('express-session')(opts.session);
    core.before.push(modern(session));
  }

  if (opts.responseTime) {
    const responseTime = require('response-time')(opts.responseTime);
    core.before.push(modern(responseTime));
  }

  // TODO: vhost: require('vhost')
  // - DO IT WITH A ROUTER

  if (opts.csrf) {
    const csrf = require('csurf')(opts.csrf);
    core.before.push(modern(csrf));

    // Set the csrf for render(): https://expressjs.com/en/api.html#res.locals
    core.before.push(ctx => {
      ctx.res.locals.csrf = ctx.req.csrfToken();
    });
  }

  // ctx => {
  //   if (!opts.middle) return;
  //   ?TODO: serveIndex: (opt, all) => require('serve-index')(all.public)
  // },


  if (opts.favicon) {
    const favicon = require('serve-favicon')(opts.favicon);
    core.before.push(modern(favicon));
  }
};
