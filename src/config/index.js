const parse = require('./parse');
const schema = require('./schema');
const env = require('./env');

module.exports = async (user = {}, plugins = []) => {

  // Parse the options set by the argument and through the env
  const options = await parse(schema, user, env);

  console.log('OPTS:', options);

  // Load plugin options namespaced with the name in parallel
  await Promise.all(plugins.map(async ({ name, options: def = {}} = {}) => {
    options[name] = await parse(def, user[name], env, options);
  }));

  console.log('OPTS2:', options);

  return options;
};
