// const compress = require('compression');
const { compression } = require('../../packages');

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
  before: ctx => ctx.utils.modern(compression(ctx.options.compress))(ctx)
};
