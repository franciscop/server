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
  init: function () {
    console.log('INIT');
  },
  before: ctx => {
    console.log('All:', ctx.options.static.public);
    return modern(ctx.express.static(ctx.options.static.public))(ctx);
  }
};
