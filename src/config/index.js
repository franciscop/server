const extend = require('extend');  // deep clone, not like shallow Object.assign
const config = require('./defaults');
const errors = require('./errors');
const type = require('./type');
require('dotenv').config({ silent: true });

// Get the process variables in lowercase
const proc = {};
for (let key in process.env) {
  proc[key.toLowerCase()] = type(process.env[key]);
}

module.exports = (user = {}, plugins = []) => {

  // If it's a number it's the port
  if (typeof user === 'number') {
    user = { port: user };
  }

  let options = extend({}, config);

  // Load the options from the plugin array, namespaced with the plugin name
  plugins.forEach(plugin => {
    const valuify = cb => cb instanceof Function ? cb(options) : cb;
    const obj = { [plugin.name]: valuify(plugin.options) };
    options = extend(true, {}, options, obj);
  });

  extend(true, options, user);

  // TODO: these notifications should not be here
  if (options.secret === 'your-random-string-here') {
    throw errors.NotSoSecret();
  }

  if ((/^secret-/.test(options.secret)) && options.verbose) {
    console.log(`
      Please change the secret in your environment configuration.
      The default one is not recommended and should be changed.
      More info in https://serverjs.io/errors#defaultSecret
    `);
  }

  return new Proxy(options, {
    get: (orig, key) => {

      // If it is set in the environment some other way
      if (typeof proc[key] !== 'undefined') {
        return proc[key];
      }

      // It was set in the options
      return options[key];
    }
  });
};
