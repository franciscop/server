// server for Node.js (https://serverjs.io/)
// A simple and powerful server for Node.js.

/* jshint esversion: 6 */

// External packages
const express = require('express');

// Internal modules
const config = require('./src/config');
const router = require('./src/router/index.js');
const join = require('./src/join/index.js');
const modern = require('./src/modern');
const error = require('./src/error');
const plugins = [
  require('./plugins/middle')
];

// Main function
function Server (...middle) {
  return new Promise((resolve, reject) => {
    "use strict";

    // First parameter can be:
    // - Number (opts)
    // - Object (opts) => cannot be ID'd
    // - undefined || null (middle)
    // - Boolean (middle)
    // - Function (middle)
    // - Array (middle)
    const opts = (
      typeof middle[0] === 'undefined' ||
      typeof middle[0] === 'boolean' ||
      middle[0] === null ||
      middle[0] instanceof Function ||
      middle[0] instanceof Array
    ) ? {} : middle.shift();

    this.express = express;
    this.app = this.express();

    // Set the options for the context of Server.js
    this.options = config(opts, plugins, this.app);

    this.modern = modern;
    this.error = error(this.options.errors);

    // Create the initial context
    const context = (req, res) => Object.assign({}, this, { req: req, res: res });

    // PLUGIN middleware
    middle = join(
      plugins.map(p => p.beforeware || p.before),
      middle,
      plugins.map(p => p.afterware || p.after)
    );

    // Main thing here
    this.app.use((req, res) => middle(context(req, res)));

    const launch = () => {
      if (this.options.verbose) {
        console.log(`Server started on port ${this.options.port} http://localhost:${this.options.port}/`);
      }

      // PLUGIN.attach: ctx => {}

      // Proxy it to the original http-server for things like .close()
      resolve(new Proxy(this, {
        get: (ctx, key) => ctx[key] || ctx.original[key]
      }));
    };

    // Start listening to requests
    this.original = this.app.listen(this.options.port, launch);

    this.original.on('error', err => reject(err));
  });
}

module.exports = (...opts) => new Server(...opts);
module.exports.router = router;
