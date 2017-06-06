const post = require('server/router/post');
const handler = require('./handler');

module.exports = (middle, data = {}, opts, path = '/') => {
  return handler(post(path, middle), { form: data, method: 'POST' }, opts);
};
