// Create a socket plugin
const socketIO = require('socket.io');
const wildcard = require('socketio-wildcard')();

module.exports = {
  name: 'socket',
  options: {},
  router: (path, ...middle) => async ctx => {
    if (ctx.replied) return;
    if (ctx.path !== path && path !== '*') return;

    ctx.replied = true;
    const ret = await ctx.utils.join(middle)(ctx);
    if (ret) {
      ctx.socket.emit(path, ret);
    }
  },
  listen: ctx => {
    const newCtx = ({ socket, path, data }) => Object.assign({}, ctx, {
      method: 'SOCKET', io: ctx.io, path, socket, data
    });

    ctx.io = socketIO(ctx.server);
    ctx.io.use(wildcard);
    ctx.io.on('connect', async socket => {
      socket.on('*', packet => {
        const [path, data] = packet.data;
        ctx.middle(newCtx({ socket, path, data }));
      });

      socket.on('disconnect', () => {
        ctx.middle(newCtx({ socket, path: 'disconnect' }));
      });

      await ctx.middle(newCtx({ socket, path: 'connect' }));
    });
  }
};
