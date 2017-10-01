const modern = require('server/src/modern');
const expressSession = require('express-session');
let session;

module.exports = {
  name: 'session',
  options: {
    __root: 'secret',
    resave: {
      default: false
    },
    saveUninitialized: {
      default: true
    },
    cookie: {
      default: {}
    },
    secret: {
      type: String,
      inherit: 'secret',
      env: 'SESSION_SECRET'
    },
    store: {
      env: false
    },
    redis: {
      type: String,
      inherit: true,
      env: 'REDIS_URL'
    }
  },
  init: ctx => {
    if (!ctx.options.session.store && ctx.options.session.redis) {
      let Redis = require('connect-redis')(session);
      ctx.options.session.store = new Redis({ url: ctx.options.session.redis });
    }
  },
  before: ctx => {
    if (!session)
      session = modern(expressSession(ctx.options.session));
    return session(ctx);
  }
};
