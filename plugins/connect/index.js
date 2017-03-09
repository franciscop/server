// Middleware plugin
// Restore some of the old Express functionality
const plugin = {
  name: 'middle',
  options: {
    public: 'public',
    compress: {},
    session: {
      resave: false,
      saveUninitialized: true,
      cookie: {}
    },
    responseTime: {},
    csrf: {}
  },
  before: require('./before')
};

module.exports = plugin;
