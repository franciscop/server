const validate = require('./validate');

// Pass it an old middleware and return a context => promise kind of
module.exports = middle => {
  validate.middleware(middle);

  // if (middleware.length === 4) => then WTF?

  // Returns a modern middleware type
  return ctx => new Promise((resolve, reject) => {
    validate.context(ctx);
    const next = err => err ? reject(err) : resolve(ctx);
    middle(ctx.req, ctx.res, next);
  });
}
