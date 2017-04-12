// Perform the routing required
const join = require('../join');
const params = require('path-to-regexp-wrap')();

// Generic request handler
const generic = (method, ...middle) => {

  // Extracted or otherwise it'd shift once per call; also more performant
  const path = typeof middle[0] === 'string' ? middle.shift() : '*';
  const match = params(path);
  middle = join(middle);

  return ctx => {

    // A route should be solved only once per request
    if (ctx.req.solved) return;

    // Only for the correct method
    if (method !== ctx.req.method) return;

    // Only do this if the correct path
    ctx.req.params = match(ctx.req.path);
    if (!ctx.req.params) return;

    // Perform this promise chain
    return middle(ctx).then(ctx => {
      ctx.req.solved = true;
      return ctx;
    });
  };
};

// Create a middleware that splits paths
exports.all  = (...middle) => generic(   'ALL', ...middle);
exports.get  = (...middle) => generic(   'GET', ...middle);
exports.post = (...middle) => generic(  'POST', ...middle);
exports.put  = (...middle) => generic(   'PUT', ...middle);
exports.del  = (...middle) => generic('DELETE', ...middle);

exports.join = join;

exports.error = (...middle) => {
  const path = typeof middle[0] === 'string' ? middle.shift() : false;
  const generic = () => {};
  generic.error = ctx => {
    // All of them if there's no path
    if (!path || path === '*') return join(middle)(ctx);

    // TODO: find a way to fix this
    const frag = ctx.error.path ? ctx.error.path.slice(0, path.length) : '';
    if (frag === path) return join(middle)(ctx);
    throw ctx.error;
  };
  return generic;
};
