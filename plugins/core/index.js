const path = require('path');

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
      inherit: 'public',
      clean: (value, arg, env, all, schema) => {
        console.log(process.platform, arg, env, all);
        if (/^win/.test(process.platform)) {
          if (value === 'C:\\Users\\Public') {
            // return (arg.public || schema.public.default);
            // return path.normalize(path.join(process.cwd(), 'test'));
            value = arg.public || schema.default;
            return value;
            // const fullpath = path.isAbsolute(value) ? value : path.join(process.cwd(), value);
            // return path.normalize(fullpath);
          }
        }
        return value;
      }
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
