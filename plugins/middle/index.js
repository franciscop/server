// Middleware plugin
// Restore some of the old Express functionality
const plugin = {
  name: 'middle',
  options: require('./options'),
  before: require('./before')
};

module.exports = plugin;
