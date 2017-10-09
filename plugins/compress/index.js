const modern = require('../../src/modern');
const compress = require('compression');

module.exports = {
  name: 'compress',
  options: {
    __root: 'compress',
    compress: {
      default: {},
      type: Object
    }
  },

  before: [
    ctx => ctx.options.compress
      ? modern(compress(ctx.options.compress))(ctx)
      : false
  ]
};
