// Modules - All of the modules that are loaded by default
const modern = require('../../src/modern');
const renaissance = mod => ctx => {
  let res = mod(ctx);
  return res ? modern(res)(ctx) : Promise.resolve();
}

const plugin = {
  name: 'middle',
  options: {
    public: 'public',
    bodyParser: { extended: true },
    jsonParser: {},
    dataParser: {},
    cookieParser: {},
    compress: {},
    session: {
      resave: false,
      saveUninitialized: true,
      cookie: {}
    },
    responseTime: {},
    methodOverride: {},
  }
};

plugin.middle = [

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
    if (ctx.options.middle.bodyParser) {
      return require('body-parser').urlencoded(ctx.options.middle.bodyParser)
    }
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
    const opts = ctx.options.middle.cookieParser || ctx.options.cookieParser;
    if (opts && opts.secret) {
      return require('cookie-parser')(ctx.options.middle.cookieParser);
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
    let opts = ctx.options.middle.session;
    if (opts.session && opts.secret) {
      return require('express-session')(opts);
    }
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

  // TODO: connectTimeout: require('connect-timeout'),
  // TODO: vhost: require('vhost'),
  // TODO: csurf: require('csurf'),
  // ?TODO: serveIndex: (opt, all) => require('serve-index')(all.public)
];

module.exports = plugin;
