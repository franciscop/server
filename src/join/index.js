const load = require('loadware');
const assert = require('assert');
const reply = require('../../reply');

// Recursively resolve possible function returns
const processReturn = async (ctx, ret) => {
  if (!ret) return;

  // Use the returned reply instance
  if (ret.constructor.name === 'Reply') {
    return await ret.exec(ctx);
  }

  // Create a whole new reply thing
  const fn = typeof ret === 'number' ? 'status' : 'send';
  return await reply[fn](ret).exec(ctx);
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
};
