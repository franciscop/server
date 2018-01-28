module.exports = (path, ...middle) => async ctx => {
  const full = ctx.req.subdomains.reverse().join('.');
  if ((typeof path === 'string' && path === full) ||
      (path instanceof RegExp && path.test(full))) {
    await ctx.utils.join(middle)(ctx);
    ctx.replied = true;
  }
};
