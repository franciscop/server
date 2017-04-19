// Final error handler
const handler = ctx => {
  // if (!ctx.res.headersSent) {
  //   ctx.res.send(ctx.ret || '');
  // }
};
handler.error = ctx => {
  if (ctx.options.verbose) {
    ctx.log("Fatal error:", ctx.error);
  }

  if (!ctx.res.headersSent) {
    ctx.res.status(500).send('Server error');
  }
};

module.exports = handler;
