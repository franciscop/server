const modern = require('server/src/modern');

module.exports = {
  name: 'static',
  options: {
    __root: 'public',
    public: {
      type: String,
      inherit: 'public',
      clean: (value, option) => {
        if (/^win/.test(process.platform) && value === 'C:\\Users\\Public') {
          return option.parent.public;
        }
        return value;
      }
    }
  },
  before: ctx => {
    return modern(ctx.express.static(ctx.options.static.public))(ctx);
  }
};
