let dotenv = require('dotenv');
dotenv.config({ silent: true });

// Modules
let express = require('express');
let bodyParser = require('body-parser');
let dataParser = require('express-data-parser');
let expressSession = require('express-session');
let cookieParser = require('cookie-parser');
let loadware = require('loadware');

let extend = require('extend');    // deep-copy, not shallow like Object.assign
let config = require('./config');  // default configuration

module.exports = (opts = {}, ...middle) => new Promise((resolve, reject) => {
  let app = express();

  // If it's a number it's the port
  if (typeof opts === 'number') {
    opts = { port: opts };
  }

  // Set the default options (deep-copy it)
  opts = extend(true, {}, config(opts), opts);

  app.set('view engine', opts.viewengine);

  // Loads the middleware into the app
  middle = loadware({
    static: express.static(opts.public),
    jsonparser: bodyParser.json(),
    bodyparser: bodyParser.urlencoded(opts.middle.bodyparser),
    dataparser: dataParser(opts.middle.dataparser),
    session: expressSession(opts.middle.session),
    cookies: cookieParser(opts.middle.cookies)
  }, middle);

  // Call each of the middlewares
  middle.forEach(mid => app.use(mid));

  // Actually start listening to the requests
  let port = process.env.PORT || opts.port;
  console.log(`Server started on port ${port} http://localhost:${port}/`);
  app.listen(port, () => resolve(app));
});

module.exports.express = express;

module.exports.router = new Proxy({}, {
  get: (orig, key) => (...args) => {
    let router = express.Router();
    router[key](...args);
    return router;
  }
});
