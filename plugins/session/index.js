const modern = require('../../src/modern');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
let fullSession;

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
      ctx.options.session.store = new RedisStore({ url: ctx.options.session.redis });
    }
    fullSession = modern(session(ctx.options.session));
  },
  before: ctx => fullSession(ctx)
};
