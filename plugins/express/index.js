const express = require('express');
const hbs = require('hbs');
const path = require('path');

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
  init: async ctx => {
    ctx.express = express;
    ctx.app = ctx.express();

    // Go through all of the options and set the right ones
    for (let key in ctx.options.express) {
      let value = ctx.options.express[key];
      if (typeof value !== 'undefined') {
        ctx.app.set(key, value);
      }
    }

    // Add the views into the core
    if (path.resolve(ctx.options.views) === path.resolve(process.cwd())) {
      throw new Error(
        'The "views" option should point to a subfolder of the project and not the root of it'
      );
    }
    await new Promise(function(resolve, reject) {
      hbs.registerPartials(ctx.options.views, function(err) {
        if (err) reject(err);
        resolve();
      });
    });

    // Accept HTML as a render extension
    ctx.app.engine('html', hbs.__express);

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
      ctx.log.debug(`Server started on http://localhost:${ctx.options.port}/`);
      resolve();
    });
    ctx.close = () => new Promise((res, rej) => {
      ctx.server.close(err => err ? rej(err) : res());
    });
    ctx.server.on('error', err => reject(err));
  })
};
