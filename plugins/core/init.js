module.exports = async ctx => {

  const modern = ctx.utils.modern;
  const opts = ctx.options.core;

  // TODO: fix it so this is not needed
  const core = require('.');
  core.before = [];

  // Compress
  if (opts.compress) {
    const compress = require('compression')(opts.compress);
    core.before.push(modern(compress));
  }

  // Public folder
  // if (opts.public) {
  //   core.before.push(modern(ctx.express.static(opts.public)));
  // }

  if (opts.session) {
    opts.session.secret = opts.session.secret || ctx.options.secret;
    const session = require('express-session');
    if (ctx.options.redis_url) {
      let RedisStore = require('connect-redis')(session);
      opts.session.store = new RedisStore({ url: ctx.options.redis_url });
    }
    core.before.push(modern(session(opts.session)));
  }

  if (opts.timing) {
    const timing = require('response-time')(opts.timing);
    core.before.push(modern(timing));
  }

  // TODO: vhost: require('vhost')
  // - DO IT WITH A ROUTER

  if (opts.csrf) {
    const csrf = require('csurf')(opts.csrf);
    core.before.push(modern(csrf));

    // Set the csrf for render(): https://expressjs.com/en/api.html#res.locals
    core.before.push(ctx => {
      ctx.csrf = ctx.req.csrfToken();
      ctx.res.locals.csrf = ctx.csrf;
    });
  }

  // ctx => {
  //   if (!opts.middle) return;
  //   ?TODO: serveIndex: (opt, all) => require('serve-index')(all.public)
  // },


  if (opts.favicon) {
    const favicon = require('serve-favicon')(opts.favicon);
    core.before.push(modern(favicon));
  }


  if (opts.partials) {
    await new Promise((resolve, reject) => {
      const hbs = require('hbs');
      hbs.registerPartials(opts.partials, (err, done) => {
        return err ? reject(err) : resolve(done);
      });
    });
  }

  // Add a reference from ctx.req.body to the ctx.data and an alias
  core.before.push(ctx => {
    for (let key in ctx.req) {
      if (key !== 'host') {
        ctx[key] = ctx.req[key];
      }
    }
    ctx.data = ctx.body;
  });
};
