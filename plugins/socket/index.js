// Create a socket plugin
const WebSocket = require('ws');
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
    const wss = ctx.wss = new WebSocket.Server({ server: ctx.server });
    wss.on('connection', socket => {
      for (const name in listeners) {
        if (name === 'connect') continue;
        for (const cb of listeners[name]) {
          socket.on(name, data => {
            cb(extend({}, ctx, { path: name, socket, data }));
          });
        }
        if (!listeners.connect) return;
        for (const cb of listeners.connect) {
          cb(extend({}, ctx, { path: 'connect', socket }));
        }
      }
    });
  }
};
