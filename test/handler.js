const server = require('../');

module.exports = server.router.error(ctx => {
  if (ctx.res.headersSent) return;
  return server.reply.status(500).send(ctx.error.message);
});
