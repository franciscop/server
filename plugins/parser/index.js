// Parser plugin
// Get the raw request and transform it into something usable
// Examples: ctx.req.body, ctx.req.files, etc
// Note: restores some of the old Express functionality
const plugin = {
  name: 'parser',
  options: {
    body: { extended: true },
    json: {},
    text: {},
    data: {},
    cookie: {},
    method: {},
  },
  before: require('./before')
};

module.exports = plugin;
