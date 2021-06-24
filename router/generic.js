const join = require('../src/join');
const parse = require('./parse');
const { match } = require('path-to-regexp');

const decode = decodeURIComponent;

// Generic request handler
module.exports = (method, ...all) => {
  // Extracted or otherwise it'd shift once per call; also more performant
  const { path, middle } = parse(all);

  // Convert to the proper path, since the new ones use `(.*)` instead of `*`
  const parsePath = match(path.replace(/\*/g, '(.*)'), { decode: decode });

  return async ctx => {
    // A route should be solved only once per request
    if (ctx.req.solved) return;

    // Only for the correct method
    if (method !== ctx.req.method) return;

    // Only do this if the correct path
    ctx.req.params = parsePath(ctx.req.path).params;
    if (!ctx.req.params) return;
    ctx.params = ctx.req.params;

    // Perform this promise chain
    await join(middle, ctx => {
      // Only solve it if all the previous middleware succeeded
      ctx.req.solved = true;
      if (!ctx.res.headersSent) {
        ctx.res.end();
      }
    })(ctx);
  };
};
