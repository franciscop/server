// Create a socket plugin
const socketIO = require('socket.io');
const wildcard = require('socketio-wildcard')();

module.exports = {
  name: 'socket',
  options: {},
  router: (path, ...middle) => async ctx => {
    if (ctx.replied) return;
    if (!path || path === '*') {
      path = ctx.path;
    }
    if (ctx.path !== path) return;

    ctx.replied = true;
    const ret = await ctx.utils.join(middle)(ctx);
    if (ret) {
      ctx.socket.emit(path, ret);
    }
  },
  listen: ctx => {
    ctx.io = socketIO(ctx.server);
    ctx.io.use(wildcard);
    ctx.io.on('connect', async socket => {

      const newCtx = ({ path, data } = {}) => Object.assign({}, ctx, {
        method: 'SOCKET', io: ctx.io, path, socket, data
      });

      socket.on('*', packet => {
        const [path, data] = packet.data;
        ctx.middle(newCtx({ path, data }));
      });

      socket.on('disconnect', () => {
        ctx.middle(newCtx({ path: 'disconnect' }));
      });

      await ctx.middle(newCtx({ path: 'connect' }));
    });
  }
};
