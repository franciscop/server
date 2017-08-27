const express = require('express');

module.exports = {
  name: 'express',
  options: {},
  init: ctx => {
    ctx.express = express;
    ctx.app = ctx.express();

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

    // Set them into express' app
    // TODO: whitelist here of name:type from
    //   https://expressjs.com/en/api.html#app.settings.table
    for (let key in ctx.options) {
      if (['boolean', 'number', 'string'].includes(typeof ctx.options[key])) {
        ctx.app.set(key, ctx.options[key]);
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
