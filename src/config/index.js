const extend = require('extend');  // deep clone, not like shallow Object.assign
const config = require('./defaults');
const errors = require('./errors');
const type = require('./type');
const env = require('dotenv').config({ silent: true });

for (let key in env) {
  if (key !== key.toLowerCase()){
    env[key.toLowerCase()] = type(env[key]);
    delete env[key];
  }
}

const proc = {};
for (let key in process.env) {
  proc[key.toLowerCase()] = type(process.env[key]);
}



module.exports = (user = {}, plugins = false, app = false) => {

  // If it's a number it's the port
  if (typeof user === 'number') {
    user = { port: user };
  }

  let options = extend({}, config);

  // Load the options from the plugin array, namespaced with the plugin name
  if (plugins) {
    plugins.forEach(plugin => {
      const valuify = cb => cb instanceof Function ? cb(options) : cb;
      const obj = { [plugin.name]: valuify(plugin.options) };
      options = extend(true, {}, options, obj);
    });
  }

  extend(true, options, user);

  // Overwrite with the env variables if set
  // They are cast for numbers and booleans
  for (let key in env) {
    options[key.toLowerCase()] = env[key];
  }

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
      // It was set from .env file
      if (typeof options[key] !== 'undefined') {
        return options[key];
      }
      // It was set through other means
      return proc[key];
    }
  });
};
