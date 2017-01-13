const extend = require('extend');    // deep clone, not like shallow Object.assign

module.exports = (config, user) => {

  // If it's a number it's the port
  if (typeof user === 'number') {
    user = { port: user };
  }

  let options = extend(true, {}, config, user);

  // Overwrite with the env variables if set
  for (let key in options) {
    if (key.toUpperCase().replace(/\s/g, '_') in process.env) {
      options[key] = process.env[key.toUpperCase().replace(/\s/g, '_')];
    }
  }

  return options;
}
