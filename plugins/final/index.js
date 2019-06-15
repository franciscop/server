// This file makes sure to clean up things in case there was something missing
// There are two reasons normally for this to happen: no reply was set or an
// unhandled error was thrown
const FinalError = require('./errors');

// Make sure that a (404) reply is sent if there was no user reply
const handler = async ctx => {
  if (!ctx.res.headersSent) {
    // Send the user-set status
    ctx.res.status(ctx.res.explicitStatus ? ctx.res.statusCode : 404).send();

    // Show it only if there was no status set in a return
    if (!ctx.res.explicitStatus) {
      ctx.log.error(
        new FinalError('noreturn', { url: ctx.url, method: ctx.method })
      );
    }
  }
};

// Make sure there is a (500) reply if there was an unhandled error thrown
handler.error = ctx => {
  const error = ctx.error;
  ctx.log.warning(FinalError('unhandled'));
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

module.exports = {
  name: 'final',
  after: handler
};
// module.exports = handler;
