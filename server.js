// External packages
const express = require('express');
const loadware = require('loadware');

// Internal modules
const config = require('./src/config');
const modules = require('./src/modules');
const router = require('./src/router.js');
const modern = require('./src/modern');
const compat = require('./src/compat');
const join = require('./src/join');


const plugins = [{
  options: {},
  app: app => {},
  middle: ctx => {},
}];


// Main function
function Server (opts = {}, ...middle) {
  return new Promise((resolve, reject) => {

    this.express = express;
    this.app = this.express();

    // Set the options or defaults
    this.options = config(opts);   // PLUGIN.options: {}

    // Set them into express' app
    // TODO: whitelist here of name:type from
    //   https://expressjs.com/en/api.html#app.settings.table
    for (let key in this.options) {
      if (['boolean', 'number', 'string'].includes(typeof this.options[key])) {
        this.app.set(key, this.options[key]);
      }
    }
    // PLUGIN.app: (app) => ...

    // Get the good modules with the options
    const goodones = Object.keys(modules).map(key => modules[key](
      this.options.middle[key] || this.options[key], this
    )).filter(sth => sth).map(modern);

    // Load the middleware into the app
    loadware(goodones, middle).forEach(mid => {
      console.log("Middle:", mid);
      this.app.use(compat(mid));
    });
    // PLUGIN.middle: opts => ctx => {}

    // Start listening to requests
    this.original = this.app.listen(this.options.port, () => {
      if (this.options.verbose) {
        console.log(`Server started on port ${port} http://localhost:${port}/`);
      }

      // PLUGIN.attach: ctx => {}

      // Proxy it to the original http-server for things like .close()
      resolve(new Proxy(this, {
        get: (ser, key) => ser[key] || ser.original[key]
      }));
    });

    this.original.on('error', err => reject(err));
  });
}

module.exports = (...opts) => new Server(...opts);
module.exports.router = router;
