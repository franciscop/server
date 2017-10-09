// Parser plugin
// Get the raw request and transform it into something usable
// Examples: ctx.body, ctx.files, etc
const join = require('../../src/join');
const modern = require('../../src/modern');

const plugin = {
  name: 'parser',
  options: {
    body: {
      type: [Object, Boolean],
      default: { extended: true },
      extend: true
    },
    json: {
      type: [Object, Boolean],
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
      type: [Object, String, Boolean],
      default: [
        'X-HTTP-Method',
        'X-HTTP-Method-Override',
        'X-Method-Override',
        '_method'
      ],
      // Coerce it into an Array if it is not already
      clean: value => typeof value === 'string' ? [value] : value
    }
  },

  // It is populated in "init()" right now:
  before: [
    ctx => {
      if (!ctx.options.parser.method) return;
      return join(ctx.options.parser.method.map(one => {
        return modern(require('method-override')(one));
      }))(ctx);
    },

    ctx => {
      if (!ctx.options.parser.body) return;
      const body = require('body-parser').urlencoded(ctx.options.parser.body);
      return modern(body)(ctx);
    },

    // JSON parser
    ctx => {
      if (!ctx.options.parser.json) return;
      const json = require('body-parser').json(ctx.options.parser.json);
      return modern(json)(ctx);
    },

    // Text parser
    ctx => {
      if (!ctx.options.parser.text) return;
      const text = require('body-parser').text(ctx.options.parser.text);
      return modern(text)(ctx);
    },

    // Data parser
    ctx => {
      if (!ctx.options.parser.data) return;
      const data = require('express-data-parser')(ctx.options.parser.data);
      return modern(data)(ctx);
    },

    // Cookie parser
    ctx => {
      if (!ctx.options.parser.cookie) return;
      const cookie = require('cookie-parser')(
        ctx.options.secret,
        ctx.options.parser.cookie
      );
      return modern(cookie)(ctx);
    },

    // Add a reference from ctx.req.body to the ctx.data and an alias
    ctx => {
      ctx.data = ctx.body;
    },
  ]
};

module.exports = plugin;
