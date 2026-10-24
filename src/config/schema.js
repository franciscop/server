const buffer = require('crypto').randomBytes(60);
const token = buffer.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
const path = require('path');

module.exports = {
  __root: 'port',
  port: {
    default: 3000,
    type: Number
  },
  public: {
    default: 'public',
    type: [String, Boolean],
    file: true,
    clean: (value, option) => {
      if (/^win/.test(process.platform) && value === 'C:\\Users\\Public') {
        value = option.arg.public || option.def.default;

        if (!value) return;
        const fullpath = path.isAbsolute(value) ? value : path.join(process.cwd(), value);
        return path.normalize(fullpath);
      }
      return value;
    }
  },
  env: {
    default: 'development',
    enum: ['production', 'test', 'development'],
    arg: false,
    env: 'NODE_ENV'
  },
  engine: {
    default: 'pug',
    type: [String, Object]
  },
  views: {
    default: 'views',
    type: String,
    folder: true
  },
  secret: {
    default: 'secret-' + token,
    type: String,
    arg: false
    // TODO: integrate this
    // if (options.secret === 'your-random-string-here') {
    //   throw new ServerError('/server/options/secret/example');
    // }
    //
    // if (/^secret-/.test(options.secret) && options.verbose) {
    //   console.log(new ServerError('/server/options/secret/generated'));
    // }
  },
  'x-powered-by': {
    default: false
  }
};
