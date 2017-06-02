// Define the router methods that are available to use as middleware
// Each of these is available through:
//   const { get } = require('server').router;
//   const { get } = require('server/router');
//   const get = require('server/router/get');

// Perform the routing required
module.exports = {

  // REST
  get    : require('./get'),
  post   : require('./post'),
  put    : require('./put'),
  del    : require('./del'),

  // Special cases
  sub    : require('./sub'),
  error  : require('./error'),
  join   : require('../src/join'),
  socket : require('../plugins/socket').router
};
