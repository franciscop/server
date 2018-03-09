const server = require('../');
const instance = require('./instance');

// Parse the server options
module.exports = (...args) => {

  // A server.js instance or the promise of it, just return it
  if (instance(args[0])) return args[0];

  // Be able to set global variables from outside
  return Object.assign({}, ...args.reverse(), {
    env: undefined,
    secret: undefined
  });
};
