// Perform the routing required
const join = require('../join');
const params = require('path-to-regexp-wrap')();

// Parse the request parameters
const parse = middle => {
  const path = typeof middle[0] === 'string' ? middle.shift() : '*';
  return { path, middle };
};

// Generic request handler
const generic = (method, ...all) => {

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
    if (ctx.ret && ctx.ret.res && ctx.ret.req && ctx.ret.options) {
      ctx.log.warning('You should NOT return the ctx in middleware!');
    }
    if (ctx.ret && !ctx.res.headersSent) {
      ctx.res.send(ctx.ret || '');
    }
  };
};

// Create a middleware that splits paths
exports.all  = (...middle) => generic(   'ALL', ...middle);
exports.get  = (...middle) => generic(   'GET', ...middle);
exports.post = (...middle) => generic(  'POST', ...middle);
exports.put  = (...middle) => generic(   'PUT', ...middle);
exports.del  = (...middle) => generic('DELETE', ...middle);

exports.join = join;

exports.error = (...all) => {
  // Extracted or otherwise it'd shift once per call; also more performant
  const { path, middle } = parse(all);
  const generic = () => {};
  generic.error = async ctx => {

    // TODO: find a way to fix this
    const frag = ctx.error.path ? ctx.error.path.slice(0, path.length) : '';

    // All of them if there's no path
    if (path === '*' || frag === path) {
      const ret = await middle[0](ctx);
      delete ctx.error;
      ctx.ret = ret || ctx.ret;
    }
  };
  return generic;
};

exports.join = join;
exports.socket = require('../../plugins/socket').router;

// Allow for calling to routers that do not exist yet
module.exports = new Proxy(exports, {
  get: (orig, key) => {
    if (orig[key]) return orig[key];
    return (...middle) => {
      const path = typeof middle[0] === 'string' ? middle.shift() : '*';
      middle = join(middle);
      let called;
      return ctx => {
        if (!called) {
          called = true;
          const routers = ctx.plugins.filter(p => p.name === key && p.router).map(p => p.router);
          routers.forEach(router => router(ctx, path, middle));
        }
      }
    }
  }
});
