module.exports = ctx => {

  const modern = ctx.utils.modern;
  const options = ctx.options.connect;
  const connect = ctx.plugins.filter(p => p.name === 'connect')[0];

  // TODO: fix it so this is not needed
  connect.before = [];

  // Inherit
  options.public = options.public || ctx.options.public;

  // Public folder
  if (options.public) {
    connect.before.push(modern(ctx.express.static(options.public)));
  }

  // Compress
  if (options.compress) {
    const compress = require('compression')(options.compress);
    connect.before.push(modern(compress));
  }

  if (options.session) {
    options.session.secret = options.session.secret || ctx.options.secret;
    const session = require('express-session')(options.session);
    connect.before.push(modern(session));
  }

  if (options.responseTime) {
    const responseTime = require('response-time')(options.responseTime);
    connect.before.push(modern(responseTime));
  }

  // // TODO: vhost: require('vhost')
  // // - DO IT WITH A ROUTER

  if (options.csrf) {
    const csrf = require('csurf')(options.csrf);
    connect.before.push(modern(csrf));

    // Set the csrf for render(): https://expressjs.com/en/api.html#res.locals
    connect.before.push(ctx => ctx.res.locals.csrf = ctx.req.csrfToken());
  }

  // ctx => {
  //   if (!ctx.options.middle) return;
  //   ?TODO: serveIndex: (opt, all) => require('serve-index')(all.public)
  // },

  // console.log(ctx.options.connect, ctx.options.connect.favicon);
  if (options.favicon) {
    const favicon = require('serve-favicon')(options.favicon);
    connect.before.push(modern(favicon));
  }
}
