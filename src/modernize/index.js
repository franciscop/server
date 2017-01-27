const validate = require('./validate');

// Pass it an old middleware and return a context => promise kind of
module.exports = middleware => {
  validate.middleware(middleware);

  return ctx => {
    return new Promise((resolve, reject) => {
      validate.context(ctx);

      const next = err => {
        err ? reject(err) : resolve(ctx);
      };
      middleware(ctx.req, ctx.res, next);
    });
  }
}
