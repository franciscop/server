const modern = require('server/src/modern');

module.exports = {
  name: 'static',
  options: {
    __root: 'public',
    public: {
      type: String,
      inherit: 'public'
    }
  },
  before: ctx => {
    console.log('Public:', ctx.options.static.public);
    return modern(ctx.express.static(ctx.options.static.public))(ctx);
  }
};
