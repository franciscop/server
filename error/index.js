const buildError = (message, opts) => {
  const error = new Error(message);
  for (const key in opts) {
    error[key] = opts[key] instanceof Function ? opts[key](opts) : opts[key];
  }
  return error;
};

const singleSlash = str => '/' + str.split('/').filter(one => one).join('/');

const ErrorFactory = function (namespace = '', defaults = {}) {
  defaults.namespace = defaults.namespace || namespace;

  return function ErrorInstance (code = '', options = {}) {
    options = Object.assign({}, ErrorFactory.options, defaults, options);
    options.code = singleSlash(options.namespace + '/' + code);
    options.id = options.code.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-/, '');
    options.message = ErrorInstance[code];
    return buildError(options.message, options);
  };
};

ErrorFactory.options = { status: 500 };

module.exports = ErrorFactory;
