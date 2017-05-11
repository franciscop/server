// Final error handler
const handler = async ctx => {
  if (ctx.ret && !ctx.res.headersSent) {
    await ctx.res.send(ctx.ret || '');
  }
  if (!ctx.res.headersSent) {
    console.log('Something very wrong:', ctx.req);
    ctx.res.sendStatus(404);
  }
};
handler.error = ctx => {
  console.log('Sent:', ctx.res.headersSent);
  if (ctx.options.verbose) {
    ctx.log("Fatal error:", ctx.error);
  }

  if (!ctx.res.headersSent) {
    ctx.res.status(500).send('Server error');
  }
};

module.exports = handler;
