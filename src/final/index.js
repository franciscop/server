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
    let status = error.status || error.code || 500;
    if (typeof status !== 'number') status = 500;

    // Display the error message if this error is marked as public
    if (error.public) {
      return ctx.res.status(status).send(error.message);
    }

    // Otherwise just display the default error for that code
    ctx.res.sendStatus(status);
  }
};

module.exports = handler;
