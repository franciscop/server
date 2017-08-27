// Middleware plugin
// Restore some of the old Express functionality
module.exports = {
  name: 'core',
  options: {
    compress: {
      default: {},
      type: Object
    },
    favicon: {
      type: String
    },
    session: {
      default: {
        resave: false,
        saveUninitialized: true,
        cookie: {}
      },
      type: Object,
      env: 'express-session',
      extend: true
    },
    timing: {
      default: {},
      type: Object
    },
    csrf: {
      default: {},
      type: Object
    }
  },

  errors: require('./errors'),

  init: require('./init'),
  before: []   // It is populated in "init()"
};
