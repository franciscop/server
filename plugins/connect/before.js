// Make express middleware into server's middleware
const modern = require('../../src/modern');
const renaissance = require('../../src/modern/renaissance');


const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false });

module.exports = [

  // Public folder
  renaissance(ctx => {
    if (!ctx.options.middle) return;
    if (ctx.options.middle.public) {
      return ctx.express.static(ctx.options.middle.public);
    }
  }),

  // Compress
  renaissance(ctx => {
    if (!ctx.options.middle) return;
    if (ctx.options.middle.compress) {
      return require('compression')(ctx.options.middle.compress);
    }
  }),

  // Session
  renaissance(ctx => {
    if (!ctx.options.middle) return;
    if (!ctx.options.middle.session) return;
    const opts = ctx.options.middle.session;
    opts.secret = opts.secret || ctx.options.secret;
    if (!opts.secret) return;

    return require('express-session')(opts);
  }),

  // Favicon
  renaissance(ctx => {
    if (!ctx.options.middle) return;
    let opt = ctx.options.middle.favicon;
    if (opt) return require('serve-favicon')(opt);
  }),

  renaissance(ctx => {
    if (!ctx.options.middle) return;
    if (ctx.options.middle.responseTime) {
      return require('response-time')(ctx.options.responseTime);
    }
  }),

  // TODO: vhost: require('vhost')
  // - DO IT WITH A ROUTER

  ctx => {
    if (!ctx.options.middle) return;
    if (!ctx.options.middle.csrf || !ctx.options.secret) return;
    return modern(csrfProtection)(ctx);
  },

  ctx => {
    if (!ctx.options.middle) return;
    if (!ctx.options.middle.csrf || !ctx.options.secret) return;
    ctx.app.locals.csrf = ctx.req.csrfToken();
  },

  // renaissance(ctx => {
  //   if (!ctx.options.middle) return;
  //   ?TODO: serveIndex: (opt, all) => require('serve-index')(all.public)
  // }),

];
