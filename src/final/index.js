// Final error handler
const handler = async ctx => {
  if (!ctx.res.headersSent) {
    ctx.res.sendStatus(ctx.res.explicitStatus ? ctx.res.statusCode : 404);
  }
};

handler.error = ctx => {
  const error = ctx.error;
  ctx.log.warning('There is an unhandled error:');
  ctx.log.error(error);
  if (!ctx.res.headersSent) {
    const status = error.status || error.code || 500;
    const message = error.public ? error.message : 'Server error';
    ctx.res.status(status).send(message);
  }
};

module.exports = handler;
