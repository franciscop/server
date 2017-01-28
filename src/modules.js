// Modules - All of the modules that are loaded by default

// ?TODO: something more solid. Maybe a thin wrapper per-module
// List mostly from http://expressjs.com/en/guide/migrating-4.html
// module.exports = [
//   ctx => modern(require('body-parser').urlencoded(ctx.middle.bodyParser))(ctx)
// ];
module.exports = {
  public: (path, self) => self.express.static(path),
  bodyParser: require('body-parser').urlencoded,
  jsonParser: require('body-parser').json,
  dataParser: require('express-data-parser'),

  compress: require('compression'),
  cookieParser: require('cookie-parser'),
  session: opt => opt && opt.secret ? require('express-session')(opt) : false,
  favicon: opt => opt ? require('serve-favicon')(opt) : false,
  responseTime: require('response-time'),
  methodOverride: require('method-override'),
  // TODO: connectTimeout: require('connect-timeout'),
  // TODO: vhost: require('vhost'),
  // TODO: csurf: require('csurf'),
  // ?TODO: serveIndex: (opt, all) => require('serve-index')(all.public)
};
