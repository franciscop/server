const normalize = require('../utils/normalize');
const params = require('../packages').pathToRegexpWrap();

// Generic request handler
module.exports = (method, ...all) => {

  // Extracted or otherwise it'd shift once per call; also more performant
  const { path, middle } = normalize(all);

  const match = params(path);

  return async ctx => {

    // A route should be replied only once per request
    if (ctx.replied) return;

    // Only for the correct method
    if (method !== ctx.method) return;

    // Only do this if the correct path
    ctx.params = match(ctx.path);
    if (!ctx.params) return;
    ctx.params = ctx.params;

    // Perform this promise chain
    await ctx.utils.join(middle)(ctx);

    ctx.replied = true;
  };
};
