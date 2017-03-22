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
const context = (self, req = {}, res = {}) => {
  return Object.assign({}, self, { req: req, res: res });
};

// Main function
function Server (...middle) {
  return new Promise((resolve, reject) => {
    "use strict";

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

    this.express = express;
    this.app = this.express();

    // Set the options for the context of Server.js
    this.plugins = module.exports.plugins;
    this.options = config(opts, this.plugins, this.app);

    this.utils = { modern: modern };
    this.modern = modern;
    // this.error = error(this.options.errors);
    this.throw = error(this.options.errors);

    this.plugins.filter(p => p.init && this.options[p.name]).forEach(p => p.init(this));

    // PLUGIN middleware
    middle = join(
      this.plugins.filter(n => this.options[n.name]).map(p => p.beforeware || p.before),
      middle,
      this.plugins.filter(n => this.options[n.name]).map(p => p.afterware || p.after),
      final
    );

    // Main thing here
    this.app.use((req, res) => middle(context(this, req, res)));

    const launch = () => {
      if (this.options.verbose) {
        console.log(`Server started on port ${this.options.port} http://localhost:${this.options.port}/`);
      }

      // PLUGIN.attach: ctx => {}

      // Proxy it to the server http-server for things like .close()
      resolve(new Proxy(this, {
        get: (ctx, key) => ctx[key] || ctx.server[key]
      }));
    };

    // Start listening to requests
    this.server = this.app.listen(this.options.port, launch);

    this.server.on('error', err => reject(error.native(err)));
  });
}

module.exports = (...opts) => new Server(...opts);
module.exports.router = router;
module.exports.utils = {
  modern: modern
};
module.exports.plugins = [
  require('./plugins/parser'),
  require('./plugins/connect'),
  require('./plugins/log')
];
