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
exports.all  = (path, ...promises) => generic(path,    'ALL', ...promises);
exports.get  = (path, ...promises) => generic(path,    'GET', ...promises);
exports.post = (path, ...promises) => generic(path,   'POST', ...promises);
exports.put  = (path, ...promises) => generic(path,    'PUT', ...promises);
exports.del  = (path, ...promises) => generic(path, 'DELETE', ...promises);
