// server for Node.js (https://serverjs.io/)
// A simple and powerful server for Node.js.

const router = require('./router');
const reply = require('./reply');
const utils = require('./utils');
const plugins = require('./plugins');

// Get the functions from the plugins for a special point
// This implies a hook can only be a function, not an array of fn
const hook = (ctx, name) => ctx.plugins.map(p => p[name]).filter(p => p);


// Main function
const Server = async (...all) => {

  // Initialize the global context from the Server properties
  const ctx = {
    router,
    reply,
    utils,
    plugins,
  };

  // Extract the options and middleware
  const { opts, middle } = ctx.utils.normalize(all);

  // Set the options for the context of Server.js
  ctx.options = await utils.options(opts, Server.plugins);

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

  ctx.close = async () => {
    for (let close of hook(ctx, 'close')) {
      await close(ctx);
    }
  };

  return ctx;
};

// Internal modules. It has to be after the exports for `session`
// to be defined, since it is defined in a plugin
Server.router = router;
Server.reply = reply;
Server.utils = utils;
Server.plugins = plugins;
Server.session = require('express-session');

module.exports = Server;
