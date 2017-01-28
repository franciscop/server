const extend = require('extend');  // deep clone, not like shallow Object.assign
const config = require('./config');
const errors = require('./errors');
require('dotenv').config({ silent: true });

function isNumeric(num){
  return !isNaN(num)
}

module.exports = (user = {}) => {

  // If it's a number it's the port
  if (typeof user === 'number') {
    user = { port: user };
  }

  let options = extend(true, {}, config, user);

  // Overwrite with the env variables if set
  for (let key in options) {
    if (key.toUpperCase().replace(/\s/g, '_') in process.env) {
      let env = process.env[key.toUpperCase().replace(/\s/g, '_')];
      if (isNumeric(env)) env = +env;
      options[key] = env;
    }
  }

  if (options.secret && options.secret === 'your-random-string-here') {
    throw errors.NotSoSecret();
  }

  return options;
}
