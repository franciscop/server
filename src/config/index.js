const parse = require('./parse');
const schema = require('./schema');
const env = require('./env');

// Accept the user options (first argument) and then a list with all the plugins
// This will allow us to use the plugin's schemas as well
module.exports = async (user = {}, plugins = []) => {

  // First and most important is the core and the user-defined options
  const options = await parse(schema, user, env);

  // Then load plugin options namespaced with the name in parallel
  await Promise.all(plugins.map(async ({ name, options: def = {}} = {}) => {
    options[name] = await parse(def, user[name], env, options);
  }));

  return options;
};
