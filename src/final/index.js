// Final error handler
const handler = () => {};
handler.error = ctx => {
  console.log("Fatal error:", ctx.error);
}
