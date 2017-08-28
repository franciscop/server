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
    // console.log('INIT');
    // const static = require('.');
    // static.before.push()
  },
  before: async ctx => {
    // console.log('All:', ctx.options.static.public);
    // console.log('A', await modern(ctx.express.static(ctx.options.static.public))(ctx));
    // return (ctx);
  }
};
