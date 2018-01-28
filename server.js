// server for Node.js (https://serverjs.io/)
// A simple and powerful server for Node.js.

// Parse the configuration
const config = require('./src/config');

// Get the functions from the plugins for a special point
// This implies a hook can only be a function, not an array of fn
const hook = (ctx, name) => ctx.plugins.map(p => p[name]).filter(p => p);


// Main function
const Server = async (...all) => {

  // Initialize the global context from the Server properties
  const ctx = Object.assign({}, Server);

  // Extract the options and middleware
  const { opts, middle } = ctx.utils.normalize(all);

  // Set the options for the context of Server.js
  ctx.options = await config(opts, Server.plugins);

  // Only allow plugins that were manually enabled through the options
  ctx.plugins = ctx.plugins.filter(p => ctx.options[p.name]);

  // All the init beforehand
  for (let init of hook(ctx, 'init')) {
    await init(ctx);
  }

  // Set the whole middleware thing into 'middle'
  // It has to be here since `init` might modify some of these
  ctx.middle = ctx.utils.join(hook(ctx, 'before'), middle, hook(ctx, 'after'));

  // Different listening methods in series
  for (let listen of hook(ctx, 'listen')) {
    await listen(ctx);
  }

  // Different listening methods in series
  for (let launch of hook(ctx, 'launch')) {
    await launch(ctx);
  }

  return ctx;
};

module.exports = Server;

// Internal modules. It has to be after the exports for `session`
// to be defined, since it is defined in a plugin
Server.router = require('./router');
Server.reply = require('./reply');
Server.utils = require('./utils');
Server.plugins = require('./plugins');
