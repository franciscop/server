const buffer = require('crypto').randomBytes(60);
const token = buffer.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');

module.exports = {
  __root: 'port',
  port: {
    default: 3000,
    type: Number
  },
  public: {
    default: 'public',
    type: [String, Boolean]
  },
  env: {
    default: 'development',
    enum: ['production', 'testing', 'development'],
    arg: false,
    env: 'NODE_ENV'
  },
  engine: {
    default: 'pug',
    type: String
  },
  secret: {
    default: 'secret-' + token,
    type: String,
    arg: false
  }
};
