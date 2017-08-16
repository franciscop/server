const get = require('server/router/get');
const handler = require('./handler');

// Middleware, data to be submitted, options for server, path to use
module.exports = (middle, data = {}, opts, path = '/') => {
  return handler(get(path, middle), { form: data }, opts);
};
