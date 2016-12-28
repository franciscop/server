let dotenv = require('dotenv');
dotenv.config({ silent: true });

// Modules
let express = require('express');
let compression = require('compression');
let favicon = require('serve-favicon');
let bodyParser = require('body-parser');
let dataParser = require('express-data-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
let loadware = require('loadware');

let extend = require('extend');    // deep-copy, not shallow like Object.assign
let config = require('./config');  // default configuration

function Server (opts = {}, ...middle) {
  if (!(this instanceof Server)) {
    return new Server(opts, ...middle);
  }

  this.options = opts;

  return new Promise((resolve, reject) => {
    let app = express();

    // If it's a number it's the port
    if (typeof this.options === 'number') {
      this.options = { port: this.options };
    }

    // Set the default options (deep-copy it)
    this.options = extend(true, {}, config(this.options), this.options);

    // TODO: this seems fragile
    for (let key in this.options) {
      if (key !== 'middle') {
        app.set(key, this.options[key]);
      }
    }

    // Loads the middleware into the app
    loadware({
      static: express.static(this.options.public),
      favicon: this.options.favicon ? favicon(this.options.favicon) : false,
      compression: compression(this.options.middle.compression),
      jsonparser: bodyParser.json(),
      bodyparser: bodyParser.urlencoded(this.options.middle.bodyparser),
      dataparser: dataParser(this.options.middle.dataparser),
      session: expressSession(this.options.middle.session),
      cookies: cookieParser(this.options.middle.cookies)
    }, middle).forEach(mid => app.use(mid));

    // Actually start listening to the requests
    let port = process.env.PORT || this.options.port;

    this.app = app;
    this.original = this.app.listen(port, () => {
      if (this.options.verbose) {
        console.log(`Server started on port ${port} http://localhost:${port}/`);
      }

      // Proxy it to the original http-server
      resolve(new Proxy(this, {
        get: (ser, key) => {
          return ser[key] || ser.original[key];
        }
      }));
    });
    this.original.on('error', err => {
      reject(err);
    });
  });
}

Server.express = express;
Server.prototype.express = express;

module.exports = Server;

module.exports.router = new Proxy({}, {
  get: (orig, key) => (...args) => {
    let router = express.Router();
    router[key](...args);
    return router;
  }
});
