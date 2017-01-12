// Modules - All of the modules that are loaded by default
dotenv: require('dotenv').config({ silent: true });

// TODO: The commented ones should be integrated
// TODO: Wrap each of them
// List mostly from http://expressjs.com/en/guide/migrating-4.html
module.exports = {
  bodyParser: require('body-parser').urlencoded,
  jsonParser: require('body-parser').json,
  dataParser: require('express-data-parser'),

  compress: require('compression'),
  // cookieSession: require('cookie-session'),
  cookieParser: require('cookie-parser'),
  // morgan: require('morgan'),
  session: opt => opt && opt.secret ? require('express-session')(opt) : false,
  favicon: opt => opt ? require('serve-favicon')(opt) : false,
  // responseTime: require('response-time'),
  // errorhandler: require('errorhandler'),
  // methodOverride: require('method-override'),
  // connectTimeout: require('connect-timeout'),
  // vhost: require('vhost'),
  // csurf: require('csurf'),
  // serveIndex: require('serve-index'),
};
