const express = require('express');

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
      let value = ctx.options.express[key];
      if (typeof value !== 'undefined') {
        ctx.app.set(key, value);
      }
    }

    // Accept HTML as a render extension
    ctx.app.engine('html', require('hbs').__express);

    if (ctx.options.engine) {
      // If it's an object, expect a { engine: { engineName: engineFN } }
      if (typeof ctx.options.engine === 'object') {
        for (let name in ctx.options.engine) {
          ctx.app.engine(name, ctx.options.engine[name]);
          ctx.app.set('view engine', name);
        }
      } else {  // Simple case like { engine: 'pug' }
        ctx.app.set('view engine', ctx.options.engine);
      }
    }
  },
  listen: ctx => new Promise((resolve, reject) => {
    ctx.server = ctx.app.listen(ctx.options.port, () => {
      if (ctx.options.verbose) {
        ctx.log(`Server started on http://localhost:${ctx.options.port}/`);
      }

      resolve();
    });
    ctx.close = () => new Promise((res, rej) => {
      ctx.server.close(err => err ? rej(err) : res());
    });
    ctx.server.on('error', err => reject(err));
  })
};
