const get = require('server/router/get');
const handler = require('./handler');

module.exports = (middle, data = {}, opts, path = '/') => {
  return handler(get(path, middle), { form: data }, opts);
};
