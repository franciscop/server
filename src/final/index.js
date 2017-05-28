// Final error handler
const handler = async ctx => {
  if (!ctx.res.headersSent) {
    ctx.res.sendStatus(ctx.res.explicitStatus ? ctx.res.statusCode : 404);
  }
};

handler.error = ctx => {

  ctx.log.error(ctx.error);
  if (!ctx.res.headersSent) {
    ctx.res.status(500).send('Server error');
  }
};

module.exports = handler;
