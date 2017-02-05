const load = require('loadware');

// Pass an array of modern middleware and return a single modern middleware
module.exports = (...middles) => ctx => load(middles).reduce((prev, next) => {

  // Make sure that we pass the original context to the next promise
  return prev.then(next).then(fake => ctx);

// Get it started with the right context
}, Promise.resolve(ctx));
