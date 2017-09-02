const modern = require('server/src/modern');

module.exports = {
  name: 'static',
  options: {
    __root: 'public',
    public: {
      type: String,
      inherit: 'public',
      env: false
    }
  },
  before: ctx => {
    return modern(ctx.express.static(ctx.options.static.public))(ctx);
  }
};
