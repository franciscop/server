const join = require('../src/join');

module.exports = (path, ...middle) => async ctx => {
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
