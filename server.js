// server for Node.js (https://serverjs.io/)
// A simple and powerful server for Node.js.

// External packages
const express = require('express');

// Internal modules
const config = require('./src/config');
const router = require('./src/router/index.js');
const join = require('./src/join/index.js');
const modern = require('./src/modern');
const error = require('./src/error');
const final = require('./src/final');

// Create the initial context
const context = (self, req, res) => Object.assign({}, self, { req, res });

// Main function
const Server = async (...middle) => {

  const ctx = {};

  // First parameter can be:
  // - options: Number || Object (cannot be ID'd)
  // - middleware: undefined || null || Boolean || Function || Array
  const opts = (
    typeof middle[0] === 'undefined' ||
    typeof middle[0] === 'boolean' ||
    middle[0] === null ||
    middle[0] instanceof Function ||
    middle[0] instanceof Array
  ) ? {} : middle.shift();

  ctx.express = express;
  ctx.app = ctx.express();

  // Set the options for the context of Server.js
  ctx.options = config(opts, module.exports.plugins, ctx.app);

  // Only enabled plugins through the config
  ctx.plugins = module.exports.plugins.filter(p => ctx.options[p.name]);

  ctx.utils = { modern: modern };
  ctx.modern = modern;
  // ctx.error = error(ctx.options.errors);
  ctx.throw = error(ctx.options.errors);

  // All the init beforehand
  const initAll = ctx.plugins.map(p => p.init).filter(p => p);
  for (let init of initAll) {
    await init(ctx);
  }

  // PLUGIN middleware
  middle = join(
    ctx.plugins.map(p => p.beforeware || p.before),
    middle,
    ctx.plugins.map(p => p.afterware || p.after),
    final
  );

  // Main thing here
  ctx.app.use((req, res) => middle(context(ctx, req, res)));

  // Start listening to requests
  return new Promise((resolve, reject) => {
    const launch = async () => {

      // After launching it
      const launchAll = ctx.plugins.map(p => p.launch).filter(p => p);
      for (let launch of launchAll) {
        await launch(ctx);
      }

      if (ctx.options.verbose) {
        ctx.log(`Server started on http://localhost:${ctx.options.port}/`);
      }

      resolve(new Proxy(ctx, { get: (orig, k) => orig[k] || orig.server[k] }));
    };

    ctx.server = ctx.app.listen(ctx.options.port, launch);
    ctx.server.on('error', err => reject(error.native(err)));
  });
}

module.exports = Server;
module.exports.router = router;
module.exports.utils = {
  modern: modern
};
module.exports.plugins = [
  require('./plugins/parser'),
  require('./plugins/connect'),
  require('./plugins/log')
];
