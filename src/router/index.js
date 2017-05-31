// Perform the routing required
const join = require('../join');
const generic = require('./generic');
const parse = require('./parse');

exports.join = join;
exports.socket = require('../../plugins/socket').router;

// Create a middleware that splits paths
exports.all  = (...middle) => generic(   'ALL', ...middle);
exports.get  = (...middle) => generic(   'GET', ...middle);
exports.post = (...middle) => generic(  'POST', ...middle);
exports.put  = (...middle) => generic(   'PUT', ...middle);
exports.del  = (...middle) => generic('DELETE', ...middle);

exports.error = (...all) => {
  // Extracted or otherwise it'd shift once per call; also more performant
  const { path, middle } = parse(all);
  const generic = () => {};
  generic.error = async ctx => {

    const fragment = (ctx.error.name || '').slice(0, path.length);

    // All of them if there's no path
    if (path === '*' || path === fragment) {
      const ret = await middle[0](ctx);
      delete ctx.error;
      return ret;
    }
  };
  return generic;
};

exports.sub = (path, ...middle) => async ctx => {
  const full = ctx.req.subdomains.join('.');
  if ((typeof path === 'string' && path === full) ||
      (path instanceof RegExp && path.test(full))) {
    await join(middle)(ctx);
    ctx.req.solved = true;
    if (ctx.ret && ctx.ret.res && ctx.ret.req && ctx.ret.options) {
      ctx.log.warning('You should NOT return the ctx in middleware!');
    }
  }
};

// Allow for calling to routers that do not exist yet
module.exports = new Proxy(exports, {
  get: (orig, key) => {
    if (orig[key]) return orig[key];
    throw new Error(`The router ${key} is not defined`);
  }
});
