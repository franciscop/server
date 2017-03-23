// Make express middleware into server's middleware
const renaissance = require('../../src/modern/renaissance');

module.exports = [

  // "Method parser"
  renaissance(ctx => {
    if (!ctx.options.parser.method) return;
    return require('method-override')(ctx.options.method);
  }),

  // Body Parser
  renaissance(ctx => {
    if (!ctx.options.parser.body) return;
    return require('body-parser').urlencoded(ctx.options.parser.body);
  }),

  // JSON parser
  renaissance(ctx => {
    if (!ctx.options.parser.json) return;
    return require('body-parser').json(ctx.options.parser.json);
  }),

  // TEXT
  renaissance(ctx => {
    if (!ctx.options.parser.text) return;
    return require('body-parser').text(ctx.options.parser.text);
  }),

  // Data parser
  renaissance(ctx => {
    if (!ctx.options.parser.data) return;
    return require('express-data-parser')(ctx.options.parser.data);
  }),

  // Cookie parser
  renaissance(ctx => {
    if (!ctx.options.parser.cookieParser) return;
    let secret = ctx.options.parser.cookieParser.secret;
    if (typeof secret !== 'string') secret = ctx.options.secret;
    return require('cookie-parser')(secret);
  })
];
