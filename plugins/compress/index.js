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

  // The whole plugin won't be loaded if the option is false
  before: ctx => modern(compress(ctx.options.compress))(ctx)
};
