const join = require('../join');
const params = require('path-to-regexp-wrap')();

// Generic request handler
const generic = (path, method, ...promises) => ctx => {

  // Only for the correct methods
  if (method !== ctx.req.method && method !== 'ALL') return;

  // Only do this if the correct path
  ctx.req.params = params(path)(ctx.req.url);
  if (!ctx.req.params) return;

  // It can/should be solved only once
  if (ctx.req.solved) return;

  // Perform this promise chain
  return join(promises)(ctx).then(ctx => {
    ctx.req.solved = true;
    return ctx;
  });
};

// Create a middleware that splits paths
exports.all  = (path, ...middle) => generic(path,    'ALL', ...middle);
exports.get  = (path, ...middle) => generic(path,    'GET', ...middle);
exports.post = (path, ...middle) => generic(path,   'POST', ...middle);
exports.put  = (path, ...middle) => generic(path,    'PUT', ...middle);
exports.del  = (path, ...middle) => generic(path, 'DELETE', ...middle);
