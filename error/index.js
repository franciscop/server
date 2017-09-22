const factory = (defaults = {}) => {
  const error = function(code, opts){
    opts = Object.assign({}, module.exports.options, defaults, opts);
    opts.code = code;
    if (!error[code]) {
      throw new Error(`The error '${code}' is not defined so you cannot use it.`);
    }
    const message = error[code] instanceof Function ? error[code](opts) : error[code];
    const err = new Error(message);
    for (let key in opts) {
      err[key] = opts[key] instanceof Function ? opts[key](opts) : opts[key];
    }
    return err;
  };
  return error;
}

module.exports = factory();
module.exports.options = {};
module.exports.defaults = defaults => factory(defaults);
