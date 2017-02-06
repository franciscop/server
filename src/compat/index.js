// Compat - Create a modern middleware from the old-style one

// Cleanly validate data
// const validate = require('./validate');

// Pass it an old middleware and return a new one 'ctx => promise'
module.exports = middle => {

  // Validate it early so no requests need to be made
  // validate.middleware(middle);

  // Create and return the modern middleware function
  return (req, res, next) => {
    // validate.context(ctx);

    // It can handle both success or errors. Pass the right ctx
    // const next = err => err ? reject(err) : resolve(ctx);

    // Call the old middleware
    let ctx = {};
    ctx.req = req;
    ctx.res = res;
    ctx.app = req.app;
    ctx.options = req.app.options;
    if (middle instanceof Promise) {
      throw new Error('You should be wrapping the function, not the factory');
    }

    let ans = middle(ctx);
    if (ans instanceof Promise) {
      return ans.then(res => next()).catch(next);
    }

    if (ans instanceof Error) {
      next(ans);
    } else {
      next();
    }
  };
}
