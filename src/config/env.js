// Load them from the environment file if any
require('dotenv').config({ silent: true });

// Check if a variable is numeric even if string
const is = {
  numeric: num => !isNaN(num),
  boolean: bool => /^(true|false)$/i.test(bool),
  json: str => /^[{[]/.test(str) && /[}\]]$/.test(str)
};

const type = str => {
  if (!str) return;
  if (typeof str !== 'string') return str;
  if (is.numeric(str)) return +str;
  if (is.boolean(str)) return /true/i.test(str);
  try {
    if (is.json(str)) return JSON.parse(str);
  } catch (err) {
    return str;
  }
  return str;
};

const env = {};
for (let key in process.env) {
  env[key] = type(process.env[key]);
}

module.exports = env;
