// Create a socket plugin
const socketIO = require('socket.io');

const server = require('server');
const { join } = server.router;

let listeners = {};

module.exports = {
  name: 'socket',
  options: {},
  // Future ideal API:
  router: (ctx, path, middle) => {
    // ...
  },

  // Hack so far
  init: ctx => {
    ctx.router = ctx.router || {};
    ctx.router.socket = (path, ...middle) => {
      listeners[path] = listeners[path] || [];
      listeners[path].push(join(middle));
    }
  },
  launch: ctx => {
    const io = socketIO(ctx.server);
    io.on('connect', socket => {
      for (name in listeners) {
        listeners[name].forEach(cb => {
          socket.on(name, (...args) => {
            cb(args, socket, io);
          });
        });
      }
    });
  }
};
