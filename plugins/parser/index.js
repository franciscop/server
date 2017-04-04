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
    method: 'X-HTTP-Method-Override',
  },
  init: require('./init'),
  before: []   // It is populated in "init()"
};

module.exports = plugin;
