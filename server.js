// server for Node.js (https://serverjs.io/)
// A simple and powerful server for Node.js.

// Internal modules
const config = require('./src/config');
const router = require('./router');
const reply = require('./reply');
const join = require('./src/join/index.js');
const modern = require('./src/modern');
const error = require('./src/error');
const final = require('./src/final');

// Create the initial context
const context = (self, req, res) => Object.assign({}, self, { req, res });

// Get the functions from the plugins for a special point
const hook = (ctx, name) => ctx.plugins.map(p => p[name]).filter(p => p);



// Main function
const Server = async (...middle) => {

  // Proxify it to use the server if a method is not in context
  // Useful for things like ctx.close()
  const ctx = new Proxy({}, {
    get: (orig, k) => orig[k] || (orig.server || {})[k]
  });

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

  // Set the options for the context of Server.js
  ctx.options = config(opts, module.exports.plugins);

  // Only enabled plugins through the config
  ctx.plugins = module.exports.plugins.filter(p => ctx.options[p.name]);

  ctx.utils = { modern: modern };
  ctx.modern = modern;
  // ctx.error = error(ctx.options.errors);
  ctx.throw = error(ctx.options.errors);

  // All the init beforehand
  for (let init of hook(ctx, 'init')) {
    await init(ctx);
  }



  // PLUGIN middleware
  middle = join(hook(ctx, 'before'), middle, hook(ctx, 'after'), final);

  // Main thing here
  ctx.app.use((req, res) => middle(context(ctx, req, res)));



  // Different listening methods
  await Promise.all(hook(ctx, 'listen').map(listen => listen(ctx)));

  // After launching it (already proxified)
  for (let launch of hook(ctx, 'launch')) {
    await launch(ctx);
  }

  return ctx;
};

module.exports = Server;
module.exports.router = router;
module.exports.reply = reply;
module.exports.utils = {
  modern: modern
};
module.exports.plugins = [
  require('./plugins/log'),
  require('./plugins/express'),
  require('./plugins/parser'),
  require('./plugins/core'),
  require('./plugins/socket'),
];
