const extend = require('extend');  // deep clone, not like shallow Object.assign
const config = require('./defaults');
const errors = require('./errors');
const env = require('./env');

module.exports = (user = {}, plugins = []) => {

  // If it's a number it's the port
  if (typeof user === 'number') {
    user = { port: user };
  }

  let options = extend({}, config);

  // Load the options from the plugin array, namespaced with the plugin name
  plugins.forEach(({ name, options: opts = {}} = {}) => {
    if (opts instanceof Function) {
      opts = opts(options[name] || {}, options);
    }
    extend(true, options, { [name]: opts });
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

      // In windows the process.env.public points to 'C:\\Users\\Public'
      if (key === 'public' && /^win/.test(process.platform)) {
        // Change it in this case where we know it's wrong for sure
        if (env.public === 'C:\\Users\\Public') {
          return options.public || 'public';
        }

        // Light check with warning
        if (env.public !== 'public') {
          // TODO: change this to a proper warning
          console.log(`
            Windows might have set the path of public to ${env.public}.
            If you changed the 'public' folder please ignore this message
          `);
        }
      }

      // If it is set in the environment some other way
      if (typeof env[key] !== 'undefined') {
        return env[key];
      }

      // It was set in the options
      return options[key];
    }
  });
};
