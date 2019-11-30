const modern = require('../../src/modern');
const server = require('../../server');
const session = require('express-session');
server.session = session;
const RedisStore = require('connect-redis')(server.session);
let sessionMiddleware;

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
      ctx.options.session.store = new RedisStore({
        url: ctx.options.session.redis
      });
    }
    sessionMiddleware = session(ctx.options.session);
  },
  before: ctx => modern(sessionMiddleware)(ctx),
  launch: ctx => {
    ctx.io.use(function(socket, next) {
      sessionMiddleware(socket.request, socket.request.res || {}, next);
    });
  }
};
