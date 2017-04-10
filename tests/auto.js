const request = require('request-promises');
const extend = require('extend');
const port = require('./helpers/port');

module.exports = opts => async ctx => {
  return await request(extend({}, {
    url: `http://localhost:${ctx.options.port}${opts.path || '/'}`,
    method: 'GET',
  }, opts));
};

module.exports.get = (path, opts) => module.exports({ method: 'GET', path, opts });
