const extend = require('extend');  // deep clone, not like shallow Object.assign
const config = require('./defaults');
const errors = require('./errors');
require('dotenv').config({ silent: true });

// Check if a variable is numeric even if string
const is = {
  numeric: num => !isNaN(num),
  boolean: b => b === true || b === false ||
    (typeof b === 'string' && ['true', 'false'].includes(b.toLowerCase()))
};

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
  for (let key in options) {
    if (key.toUpperCase().replace(/\s/g, '_') in process.env) {
      let env = process.env[key.toUpperCase().replace(/\s/g, '_')];

      // Convert it to Number if it's numeric
      if (is.numeric(env)) env = +env;
      if (is.boolean(env)) env = typeof env === 'string' ? env === 'true' : env;
      options[key] = env;
    }
  }

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

  return options;
};
