// Create a socket plugin
const socketIO = require('socket.io');
const extend = require('extend');

const listeners = {};

module.exports = {
  name: 'socket',
  options: {},
  router: (path, middle) => {
    listeners[path] = listeners[path] || [];
    listeners[path].push(middle);
  },
  launch: ctx => {
    ctx.io = socketIO(ctx.server);
    ctx.io.on('connect', socket => {
      for (let name in listeners) {
        if (name !== 'connect') {
          listeners[name].forEach(cb => {
            socket.on(name, data => {
              cb(extend({}, ctx, { path: name, socket: socket, data: data }));
            });
          });
        }
      }
      if (listeners['connect']) {
        listeners['connect'].forEach(cb => {
          cb(extend({}, ctx, { path: 'connect', socket: socket }));
        });
      }
    });
  }
};
