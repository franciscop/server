const modern = require('../../src/modern');
const favicon = require('serve-favicon');

module.exports = {
  name: 'favicon',
  options: {
    __root: 'location',
    location: {
      type: String,
      file: true,
      env: 'FAVICON'
    }
  },

  before: [
    ctx => {
      if (!ctx.options.favicon.location) return false;
      return modern(favicon(ctx.options.favicon.location))(ctx);
    }
  ]
};
