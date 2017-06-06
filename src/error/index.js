const native = require('./errors.js');
const nicknames = {
  EADDRINUSE: 'PortAlreadyUsed'
};

// Create a new error from all the available ones and the argument passed
module.exports = errors => (name, opts) => {
  const err = errors && errors[name] ?
    (errors[name] instanceof Function ?
      errors[name](opts) :
      errors[name]
    ) : new Error(name);

  err.name = name;
  throw err;
};

// Same as above, but named "throw"
module.exports.throw = errors => (name, opts) => {
  const err = errors && errors[name] ?
    (errors[name] instanceof Function ?
      errors[name](opts) :
      errors[name]
    ) : new Error(name);

  err.name = name;
  throw err;
};

// Map the native error to the custom defined one through the nicknames
module.exports.native = err => {
  if (nicknames[err.code]) {
    return native[nicknames[err.code]](err);
  }
  return err;
};
