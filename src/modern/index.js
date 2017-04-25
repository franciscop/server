// Modern - Create a modern middleware from the old-style one

// Cleanly validate data
const validate = require('./validate');

// Pass it an old middleware and return a new one 'ctx => promise'
module.exports = middle => {

  // Validate it early so no requests need to be made
  validate.middleware(middle);

  // Create and return the modern middleware function
  return ctx => new Promise((resolve, reject) => {
    validate.context(ctx);

    // It can handle both success or errors. Pass the right ctx
    const next = err => err ? reject(err) : resolve();

    // Call the old middleware
    middle(ctx.req, ctx.res, next);
  });
};
