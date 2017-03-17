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



  if (app) {
    app.options = options;

    // Set them into express' app
    // TODO: whitelist here of name:type from
    //   https://expressjs.com/en/api.html#app.settings.table
    for (let key in options) {

      // Engine is a nickname of 'view engine'
      if (key === 'engine') {

        // If it's an object, expect a { engine: { engineName: engineFN } }
        if (typeof options[key] === 'object') {
          const engineName = Object.keys(options[key])[0];
          app.engine(engineName, options[key][engineName]);
          app.set('view engine', engineName);
        } else {  // Simple case like { engine: 'pug' }
          app.set('view engine', options[key]);
        }
      }
      if (app.set && ['boolean', 'number', 'string'].includes(typeof options[key])) {
        app.set(key, options[key]);
      }
    }
  }

  return options;
};
