// Final error handler
const handler = () => {};
handler.error = ctx => {
  ctx.log("Fatal error:", ctx.error);

  if (!ctx.res.headerSent) {
    ctx.res.status(500).send('Server error');
  }
};

module.exports = handler;
