// Middleware plugin
// Restore some of the old Express functionality
module.exports = {
  name: 'core',
  options: {
    compress: {},
    session: {
      resave: false,
      saveUninitialized: true,
      cookie: {}
    },
    responseTime: {},
    csrf: {}
  },

  errors: require('./errors'),

  init: require('./init'),
  before: []   // It is populated in "init()"
};
