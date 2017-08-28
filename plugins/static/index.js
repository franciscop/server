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
  init: ctx => {
    console.log('INIT');
    const static = require('.');
    static.before.push(modern(ctx.express.static(ctx.options.static.public)));
  },
  before: []
};
