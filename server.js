let dotenv = require('dotenv');
dotenv.config({ silent: true });

// Modules
// TODO: The commented ones should be integrated
// List from http://expressjs.com/en/guide/migrating-4.html
let bodyParser = require('body-parser');
let dataParser = require('express-data-parser');
let express = require('express');
let compression = require('compression');
// const cookieSession = require('cookie-session');
let cookieParser = require('cookie-parser');
// const morgan = require('morgan');
let expressSession = require('express-session');
let favicon = require('serve-favicon');
// const responseTime = require('response-time');
// const errorhandler = require('errorhandler');
// const methodOverride = require('method-override');
// const connectTimeout = require('connect-timeout');
// const vhost = require('vhost');
// const csurf = require('csurf');
// const serveIndex = require('serve-index');
let loadware = require('loadware');




let extend = require('extend');    // deep-copy&clone, not like Object.assign

function Server (opts = {}, ...middle) {
  if (!(this instanceof Server)) {
    return new Server(opts, ...middle);
  }

  this.app = express();

  // If it's a number it's the port
  if (typeof opts === 'number') {
    opts = { port: opts };
  }

  // Set the default options (deep-copy it)
  this.options = extend(true, {}, this.options, opts);

  // TODO: this seems fragile
  for (let key in this.options) {
    if (key !== 'middle') {
      this.app.set(key, this.options[key]);
    }

    // Overwrite with the env variables if set
    if (key.toUpperCase() in process.env) {
      this.options[key] = process.env[key.toUpperCase().replace(/\s/g, '_')];
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
  }, middle).forEach(mid => this.app.use(mid));


  return new Promise((resolve, reject) => {
    // Actually start listening to the requests
    this.original = this.app.listen(this.options.port, () => {
      if (this.options.verbose) {
        console.log(`Server started on port ${port} http://localhost:${port}/`);
      }

      // Proxy it to the original http-server
      resolve(new Proxy(this, {
        get: (ser, key) => ser[key] || ser.original[key]
      }));
    });

    this.original.on('error', err => reject(err));
  });
}

Server.express = express;
Server.prototype.express = express;
Server.prototype.options = require('./config');

module.exports = Server;

module.exports.router = require('./router.js');
