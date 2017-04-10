const express = require('express');
const error = require('../../src/error');

module.exports = {
  name: 'express',
  options: {},
  init: ctx => {
    ctx.express = express;
    ctx.app = ctx.express();

    if (ctx.options.engine) {
      // If it's an object, expect a { engine: { engineName: engineFN } }
      if (typeof ctx.options.engine === 'object') {
        const engineName = Object.keys(ctx.options.engine)[0];
        ctx.app.engine(engineName, ctx.options.engine[engineName]);
        ctx.app.set('view engine', engineName);
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
    ctx.server.on('error', err => reject(error.native(err)));
  })
};
