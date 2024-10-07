// Create a socket plugin
const socketIO = require('socket.io');

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
    wsEngine: {},
    cors: {},
  },
  router: (path, middle) => {
    listeners[path] = listeners[path] || [];
    listeners[path].push(middle);
  },
  launch: ctx => {
    if (!ctx.options.socket) return;
    if (listeners.ping) {
      ctx.log.warning('socket("ping") has a special meaning, please avoid it');
    }
    ctx.io = socketIO(ctx.server, ctx.options.socket);
    ctx.io.on('connect', socket => {
      // Create a new context assigned to each connected socket
      const createContext = extra => {
        return Object.assign({}, socket.client.request, ctx, extra);
      };

      // Attach a `socket.on('name', cb)` to each of the callbacks
      for (let path in listeners) {
        if (path !== 'connect') {
          listeners[path].forEach(cb => {
            socket.on(path, data => cb(createContext({ path, socket, data })));
          });
        }
      }

      // This is not a callback and should be called straight away since we are
      // already inside `io.on('connect')`
      const path = 'connect';
      if (listeners['connect']) {
        listeners[path].forEach(cb => cb(createContext({ path, socket })));
      }
    });
  }
};
