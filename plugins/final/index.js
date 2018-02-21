// This file makes sure to clean up things in case there was something missing
// There are two reasons normally for this to happen: no reply was set or an
// unhandled error was thrown
const FinalError = require('./errors');

const { error } = require('../../router');
const { status } = require('../../reply');

// Make sure that a (404) reply is sent if there was no user reply
const statusHandler = async ctx => {
  if (!ctx.res) return;
  if (ctx.res.headersSent) return;

  // Send the user-set status
  if (ctx.res.explicitStatus) {
    return status(ctx.res.statusCode).send();
  }

  // Show it only if there was no status set in a return
  const err = new FinalError('noreturn', { status: 404, path: ctx.path });
  ctx.log.error(err.message);
  return status(404).send();
};

// Make sure there is a (500) reply if there was an unhandled error thrown
const errorHandler = ctx => {
  const error = ctx.error;
  ctx.log.error(error);
  if (ctx.res.headersSent) return;

  let status = error.status || error.code || 500;
  if (typeof status !== 'number') status = 500;

  // Display the error message if this error is marked as public
  if (error.public || ctx.options.env === 'test') {
    return ctx.res.status(status).send(error.message);
  }

  // Otherwise just display the default error for that code
  ctx.res.sendStatus(status);
};

module.exports = {
  name: 'final',
  // after: handler,
  after: [
    statusHandler,
    error(errorHandler)
  ]
};
// module.exports = handler;
