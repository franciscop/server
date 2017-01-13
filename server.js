// The default modules to load
const modules = require('./src/modules');
const config = require('./src/config');
const router = require('./src/router.js');
const options = require('./src/options');   // Options loader



// The external packages to be used besides the modules
let express = require('express');
let loadware = require('loadware');



// Main function
function Server (opts = {}, ...middle) {
  if (!(this instanceof Server)) {
    return new Server(opts, ...middle);
  }

  return new Promise((resolve, reject) => {

    this.express = express;
    this.app = this.express();

    // Set the default options (deep-copy it)
    this.options = options(config, opts);

    // Set them into express' app
    // TODO: whitelist here of name:type from
    //   https://expressjs.com/en/api.html#app.settings.table
    for (let key in this.options) {
      if (['boolean', 'number', 'string'].includes(typeof this.options[key])) {
        this.app.set(key, this.options[key]);
      }
    }

    // Get only the good modules
    let goodones = { static: express.static(this.options.public) };
    for (var key in modules) {
      let options = this.options.middle[key] || this.options[key];
      goodones[key] = modules[key](options, this.options);
    }

    // Load the middleware into the app
    loadware(goodones, middle).forEach(mid => this.app.use(mid));

    // Start listening to requests
    this.original = this.app.listen(this.options.port, () => {
      if (this.options.verbose) {
        console.log(`Server started on port ${port} http://localhost:${port}/`);
      }

      // Allow for some hooks (as in socket.io)
      if (this.attach && this.attach.length) {
        this.attach.forEach(attachable => attachable(this));
      }

      // Proxy it to the original http-server for things like .close()
      resolve(new Proxy(this, {
        get: (ser, key) => ser[key] || ser.original[key]
      }));
    });

    this.original.on('error', err => reject(err));
  });
}

module.exports = Server;
module.exports.router = router;
