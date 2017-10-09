const modern = require('../../src/modern');

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
  init: ctx => {
    module.exports.before = [
      modern(ctx.express.static(ctx.options.static.public))
    ];
  }
};
