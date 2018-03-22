const express = require('express');

// Transform a modern engine into an old one
const modernEngine = engine => async (file, opts, cb) => {
  try {
    const res = await engine(file, opts);
    cb(null, res);
  } catch (err) {
    cb(err);
  }
};

// Main plugin
module.exports = {
  name: 'express',
  options: {
    // See these in-depth in https://expressjs.com/en/api.html#app.set
    'case sensitive routing': {},
    'env': {
      inherit: 'env'
    },
    'etag': {},
    'jsonp callback name': {},
    'json replacer': {},
    'json spaces': {},
    'query parser': {},
    'strict routing': {},
    'subdomain offset': {},
    'trust proxy': {},
    'views': {
      default: 'views',
      inherit: true,
      type: String,
      folder: true
    },
    'view cache': {},
    'view engine': {
      inherit: 'engine'
    },
    'x-powered-by': {}
  },
  init: ctx => {
    ctx.express = express;
    ctx.app = ctx.express();

    // Go through all of the options and set the right ones
    for (let key in ctx.options.express) {
      ctx.app.set(key, ctx.options.express[key]);
    }

    // Accept HTML as a render extension
    ctx.app.engine('html', require('hbs').__express);

    // No engine, it's easy
    if (!ctx.options.engine) return;

    // Simple case like { engine: 'pug' }
    if (typeof ctx.options.engine === 'string') {
      return ctx.app.set('view engine', ctx.options.engine);
    }

    // If it's an object, expect a { engine: { engineName: engineFN } }
    for (let name in ctx.options.engine) {
      const engine = ctx.options.engine[name];
      ctx.app.engine(name, engine.length === 3 ? engine : modernEngine(engine));
      ctx.app.set('view engine', name);
    }
  },
  listen: ctx => new Promise(resolve => {
    const context = (self, req, res) => Object.assign(req, self, { req, res }, { locals: res.locals });
    ctx.app.use((req, res) => ctx.middle(context(ctx, req, res)));

    ctx.server = ctx.app.listen(ctx.options.port, () => {
      ctx.log.debug(`Server started on http://localhost:${ctx.options.port}/`);
      resolve();
    });
  }),
  close: ctx => new Promise((resolve, reject) => {
    ctx.server.close(err => err ? reject(err) : resolve());
  })
};
