const server = require('../');
const instance = require('./instance');

// Parse the server options
module.exports = (opts = {}, general = {}, defaults = {}) => {

  // A server.js instance or the promise of it, just return it
  if (instance(opts)) return opts;

  // Be able to set global variables from outside
  return Object.assign({}, defaults, general, opts, {
    env: undefined,
    secret: undefined
  });
};
