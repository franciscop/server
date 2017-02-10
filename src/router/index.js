const join = require('../join');
const params = require('path-to-regexp-wrap')();

// Generic request handler
// TODO: optimize? by extracting params(path) outside
const generic = (method, ...middle) => ctx => {

  // A route should be solved only once
  if (ctx.req.solved) return;

  // Only for the correct methods
  if (method !== ctx.req.method) return;

  // Only do this if the correct path
  const path = typeof middle[0] === 'string' ? middle.shift() : '*';
  ctx.req.params = params(path)(ctx.req.url);
  if (!ctx.req.params) return;

  // Perform this promise chain
  return join(middle)(ctx).then(ctx => {
    ctx.req.solved = true;
    return ctx;
  });
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
