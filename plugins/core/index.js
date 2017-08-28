// Middleware plugin
// Restore some of the old Express functionality
module.exports = {
  name: 'core',
  options: {
    compress: {
      default: {},
      type: Object
    },
    public: {
      type: String,
      inherit: 'public'
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

  init: require('./init'),
  before: []   // It is populated in "init()"
};
