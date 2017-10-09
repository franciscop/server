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
    ctx => ctx.options.favicon && ctx.options.favicon.location
      ? modern(favicon(ctx.options.favicon.location))(ctx)
      : false
  ]
};
