// Create a socket plugin
const socketIO = require('socket.io');
const extend = require('extend');

const listeners = {};

module.exports = {
  name: 'socket',
  options: {
    path: {
      env: 'SOCKET_PATH'
    },
    serveClient: {},
    adapter: {},
    origins: {},
    parser: {},
    pingTimeout: {},
    pingInterval: {},
    upgradeTimeout: {},
    maxHttpBufferSize: {},
    allowRequest: {},
    transports: {},
    allowUpgrades: {},
    perMessageDeflate: {},
    httpCompression: {},
    cookie: {},
    cookiePath: {},
    cookieHttpOnly: {},
    wsEngine: {}
  },
  router: (path, middle) => {
    listeners[path] = listeners[path] || [];
    listeners[path].push(middle);
  },
  launch: ctx => {
    if (!ctx.options.socket) return;
    ctx.io = socketIO(ctx.server, ctx.options.socket);
    ctx.io.on('connect', socket => {
      // console.log(socket.client.request.session);
      for (let path in listeners) {
        if (path !== 'connect') {
          listeners[path].forEach(cb => {
            socket.on(path, data => {
              cb(extend(socket.client.request, ctx, { path, socket, data }));
            });
          });
        }
      }
      if (listeners['connect']) {
        listeners['connect'].forEach(cb => {
          cb(extend(socket.client.request, ctx, { path: 'connect', socket }));
        });
      }
    });
  }
};
