// Log plugin
// Get the raw request and transform it into something usable
// Examples: ctx.req.body, ctx.req.files, etc
// Note: restores some of the old Express functionality
const plugin = {
  name: 'log',
  options: { level: 'debug' },
  init: ctx => ctx.log = ((...args) => console.log(...args))
};

module.exports = plugin;
