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
    const stat = require('.');
    stat.before.push(modern(ctx.express.static(ctx.options.static.public)));
  },
  before: []
};
