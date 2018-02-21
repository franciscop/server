const server = require('../');
const port = require('./port');
const instance = require('./instance');

// Parse the server options
module.exports = (opts, defaults = {}) => {

  // A server.js instance or the promise of it
  if (instance(opts)) {
    return opts;
  }

  // In case the port is the defaults one
  const synthetic = !opts || !opts.port;

  // Create the port when none was specified
  if (synthetic) opts.port = port();

  // Be able to set global variables from outside
  opts = Object.assign({}, opts, defaults, {
    env: undefined,
    secret: undefined
  });

  return opts;
};
