const server = require('server');
const port = require('server/test/helpers/port');

module.exports = (middle = [], opts = {}) => {
  opts = Object.assign({}, { port: port() }, opts);
  return server(opts, middle);
};
