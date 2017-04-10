const load = require('loadware');

// Pass an array of modern middleware and return a single modern middleware
module.exports = (...middles) => ctx => load(middles).reduce((prev, next) => {

  const handler = err => {

    // Keep throwing it until a middleware tries to catch it
    if (!next.error || !(next.error instanceof Function)) {
      throw err;
    }

    // Middleware to handle it
    ctx.error = err;
    return next.error(ctx);
  };

  // Make sure that we pass the original context to the next promise
  // Catched errors should not be passed to the next thing
  return prev.catch(handler).then(fake => ctx).then(next).then(async ret => {
    if (ret instanceof Function) {
      await ret(ctx);
    }
    return ctx;
  });

// Get it started with the right context
}, Promise.resolve(ctx));
