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
  before: ctx => ctx.utils.modern(compress(ctx.options.compress))(ctx)
};
