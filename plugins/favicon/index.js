const { serveFavicon } = require('../../packages');

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
      ? ctx.utils.modern(serveFavicon(ctx.options.favicon.location))(ctx)
      : false
  ]
};
