// Load them from the environment file if any
require('dotenv').config({ silent: true });

// Parse the different types of files from the env
const type = require('./type');

// Get the process variables in lowercase
const env = {};
for (let key in process.env) {
  env[key.toLowerCase()] = type(process.env[key]);
}

module.exports = env;
