// Middleware plugin
// Restore some of the old Express functionality
module.exports = {
  name: 'core',
  options: {
    compress: {
      default: {},
      type: Object
    },
    // public: {
    //   type: String,
    //   inherit: 'public',
    //   clean: (value, option) => {
    //     if (/^win/.test(process.platform) && value === 'C:\\Users\\Public') {
    //       return option.parent.public;
    //     }
    //     return value;
    //   }
    // },
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
