// Modern - Create a modern middleware from the old-style one

// Valid HTTP methods acording to RFC 7231 and RFC 5789
const methods = [
  'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE'
];

// Cleanly validate data
const validate = require('./validate');

// Pass it an old middleware and return a new one 'ctx => promise'
module.exports = middle => {

  // Validate it early so no requests need to be made
  validate.middleware(middle);

  // Create and return the modern middleware function
  return ctx => new Promise((resolve, reject) => {

    // modern() only works for HTTP requests
    if (!methods.includes(ctx.method.toUpperCase())) {
      return resolve();
    }

    validate.context(ctx);

    // It can handle both success or errors. Pass the right ctx
    const next = err => err ? reject(err) : resolve();

    // Call the old middleware
    middle(ctx.req, ctx.res, next);
  });
};
