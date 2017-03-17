// Modules - All of the modules that are loaded by default
// For some reason, the tests are in /test/connect.test.js
const modern = require('../../src/modern');

// This is not the middleware itself; it is called on init once and returns the
// actual middleware
module.exports = mod => ctx => {
  const res = mod(ctx, ctx.options);
  return res ? modern(res)(ctx) : Promise.resolve();
};
