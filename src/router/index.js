// Perform the routing required
const join = require('../join');
const params = require('path-to-regexp-wrap')();

// Generic request handler
const generic = (method, ...middle) => {

  // Only do this if the correct path
  // It has been extracted because otherwise it'd shift once per call
  const path = typeof middle[0] === 'string' ? middle.shift() : '*';
  const match = params(path);
  const joined = join(middle);

  return ctx => {

    // A route should be solved only once per request
    if (ctx.req.solved) return;

    // Only for the correct method
    if (method !== ctx.req.method) return;

    // Continue if the URL is not the correct one
    if (!match(ctx.req.url)) return;

    // Perform this promise chain
    return joined(ctx).then(ctx => {
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

exports.error = (...middle) => {
  let path = typeof middle[0] === 'string' ? middle.shift() : false;
  let parser = params(path);
  let generic = () => {};
  generic.error = ctx => {
    // All of them if there's no path
    if (!path) return join(middle)(ctx);

    const frag = ctx.error.path ? ctx.error.path.slice(0, path.length) : '';
    if (frag === path) return join(middle)(ctx);
    throw ctx.error;
  }
  return generic;
}
