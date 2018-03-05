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

  // Errors should be thrown to trickle down
  if (ret instanceof Error) {
    throw ret;
  }

  // TODO: make a check for only accepting the right types of return values

  // Create a whole new reply thing
  const fn = typeof ret === 'number' ? 'status' : 'send';

  if (ctx.res) {
    return await reply[fn](ret).exec(ctx);
  }
  return ret;
};

// Pass an array of modern middleware and return a single modern middleware
module.exports = (...middles) => {

  // Flattify all of the middleware
  const middle = load(middles);

  // Go through each of them
  return async ctx => {
    let globalReturn = false;
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
          globalReturn = await processReturn(ctx, ret) || globalReturn;
        }
      } catch (err) {
        ctx.error = err;
      }
    }
    return globalReturn;
  };
};
