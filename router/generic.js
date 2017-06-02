const join = require('../src/join');
const parse = require('./parse');
const params = require('path-to-regexp-wrap')();

// Generic request handler
module.exports = (method, ...all) => {

  // Extracted or otherwise it'd shift once per call; also more performant
  const { path, middle } = parse(all);

  const match = params(path);

  return async ctx => {

    // A route should be solved only once per request
    if (ctx.req.solved) return;

    // Only for the correct method
    if (method !== ctx.req.method) return;

    // Only do this if the correct path
    ctx.req.params = match(ctx.req.path);
    if (!ctx.req.params) return;

    // Perform this promise chain
    await join(middle)(ctx);

    ctx.req.solved = true;
  };
};
