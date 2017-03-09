// Modules - All of the modules that are loaded by default
// For some reason, the tests are in /test/connect.test.js
const modern = require('../../src/modern');

// This is not the middleware itself; it is called on init once and returns the
// actual middleware
const renaissance = mod => ctx => {
  let res = mod(ctx, ctx.options);
  return res ? modern(res)(ctx) : Promise.resolve();
}

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

  // Body Parser
  renaissance(ctx => {
    if (!ctx.options.middle) return;
    if (!ctx.options.middle.bodyParser) return;
    return require('body-parser').urlencoded(ctx.options.middle.bodyParser);
  }),

  // JSON parser
  renaissance(ctx => {
    if (!ctx.options.middle) return;
    if (ctx.options.middle.jsonParser) {
      return require('body-parser').json(ctx.options.middle.jsonParser);
    }
  }),

  // Data parser
  renaissance(ctx => {
    if (!ctx.options.middle) return;
    if (ctx.options.middle.dataParser) {
      return require('express-data-parser')(ctx.options.middle.dataParser);
    }
  }),

  // Cookie parser
  renaissance(ctx => {
    if (!ctx.options.middle) return;
    if (!ctx.options.middle.cookieParser) return;
    let secret = ctx.options.middle.cookieParser.secret;
    if (typeof secret !== 'string') secret = ctx.options.secret;
    return require('cookie-parser')(secret);
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

  renaissance(ctx => {
    if (!ctx.options.middle) return;
    if (ctx.options.middle.methodOverride) {
      return require('method-override')(ctx.options.methodOverride);
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
