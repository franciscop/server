const load = require('loadware');
const assert = require('assert');
const reply = require('../reply');

// Recursively resolve possible function returns and assign the value to .ret
const processReturn = async (ctx, ret) => {
  if (!ret) return;
  if (ret !== reply) {
    reply.send(ret).exec(ctx);
  }
  await reply.exec(ctx);
};

// Pass an array of modern middleware and return a single modern middleware
module.exports = (...middles) => {

  // Flattify all of the middleware
  const middle = load(middles);

  // Go through each of them
  return async ctx => {
    for (const mid of middle) {
      try {
        // DO NOT MERGE; the else is relevant only for ctx.error
        if (ctx.error) {
          // See if this middleware can fix it
          if (mid.error) {
            assert(mid.error instanceof Function, 'Error handler should be a function');
            let ret = await mid.error(ctx);
            await processReturn(ctx, ret);
          }
        }
        // No error, call next middleware. Skips middleware if there's an error
        else {
          let ret = await mid(ctx);
          await processReturn(ctx, ret);
        }
      } catch (err) {
        ctx.error = err;
      }
    }
  };

  // // Join: ctx = join(() => {}, () => {}, () => {})(ctx)
  // return async ctx => middle.reduce((prev, next) => {
  //
  //   const handler = err => {
  //
  //     // Keep throwing it until a middleware tries to catch it
  //     if (!next.error || !(next.error instanceof Function)) {
  //       throw err;
  //     }
  //
  //     // Middleware to handle it
  //     ctx.error = err;
  //     return next.error(ctx);
  //   };
  //
  //   // Make sure that we pass the original context to the next promise
  //   // Catched errors should not be passed to the next thing
  //   return prev.catch(handler).then(ignore => next(ctx)).then(async ret => {
  //     if (ret instanceof Function) {
  //       ret = await ret(ctx);
  //     }
  //     if (ret instanceof Array
  //       || ret instanceof Object
  //       || ['string', 'number'].includes(typeof ret)) {
  //       ctx.ret = ret;
  //     }
  //   });
  //
  //   // Get it started with the right context
  // }, Promise.resolve(ctx));
};
