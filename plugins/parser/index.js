// Parser plugin
// Get the raw request and transform it into something usable
// Examples: ctx.req.body, ctx.req.files, etc
// Note: restores some of the old Express functionality
const plugin = {
  name: 'parser',
  options: {
    body: {
      type: Object,
      default: { extended: true },
      extend: true
    },
    json: {
      type: Object,
      default: {}
    },
    text: {
      type: Object,
      default: {}
    },
    data: {
      type: Object,
      default: {}
    },
    cookie: {
      type: Object,
      default: {}
    },
    method: {
      type: Object,
      default: ['X-HTTP-Method-Override', '_method']
    }
  },
  init: require('./init'),
  before: []   // It is populated in "init()"
};

module.exports = plugin;
