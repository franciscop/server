
// Check if a variable is numeric even if string
const is = {
  numeric: num => !isNaN(num),
  boolean: bool => /^(true|false)$/i.test(bool),
  json: str => /^[\{\[]/.test(str) && /[\}\]]$/.test(str)
};

module.exports = (str = '') => {
  if (typeof str !== 'string') {
    return str;
  }

  if (is.numeric(str)) {
    return +str;
  }

  if (is.boolean(str)) {
    str = /true/i.test(str);
  }

  if (is.json(str)) {
    str = JSON.parse(str);
  }

  return str;
};
