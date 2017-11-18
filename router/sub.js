const join = require('../src/join');

module.exports = (path, ...middle) => async ctx => {
  const full = ctx.req.subdomains.reverse().join('.');
  if ((typeof path === 'string' && path === full) ||
      (path instanceof RegExp && path.test(full))) {
    await join(middle)(ctx);
    ctx.req.solved = true;
  }
};
