module.exports = ctx => {

  const modern = ctx.utils.modern;
  const options = ctx.options.parser;
  const parser = ctx.plugins.filter(p => p.name === 'parser')[0];

  // TODO: fix it so this is not needed
  parser.before = [];

  // "Method parser"
  if (options.method) {
    const methods = typeof options.method === 'string' ? [options.method] : options.method;
    methods.forEach(one => {
      const method = require('method-override')(one);
      parser.before.push(modern(method));
    });
  }

  // Body Parser
  if (options.body) {
    const body = require('body-parser').urlencoded(options.body);
    parser.before.push(modern(body));
  }

  // JSON parser
  if (options.json) {
    const json = require('body-parser').json(options.json);
    parser.before.push(modern(json));
  }

  // Text parser
  if (options.text) {
    const text = require('body-parser').text(options.text);
    parser.before.push(modern(text));
  }

  // Data parser
  if (options.data) {
    const data = require('express-data-parser')(options.data);
    parser.before.push(modern(data));
  }

  // Data parser
  if (options.cookie) {
    let secret = options.cookie.secret;
    if (typeof secret !== 'string') {
      secret = ctx.options.secret;
    }
    const cookie = require('cookie-parser')(secret);
    parser.before.push(modern(cookie));
  }
};





//   // "Method parser"
//   renaissance(ctx => {
//     if (!ctx.options.parser.method) return;
//     return require('method-override')(ctx.options.method);
//   }),
//
//   // Body Parser
//   renaissance(ctx => {
//     if (!ctx.options.parser.body) return;
//     return require('body-parser').urlencoded(ctx.options.parser.body);
//   }),
//
//   // JSON parser
//   renaissance(ctx => {
//     if (!ctx.options.parser.json) return;
//     return require('body-parser').json(ctx.options.parser.json);
//   }),
//
//   // TEXT
//   renaissance(ctx => {
//     if (!ctx.options.parser.text) return;
//     return require('body-parser').text(ctx.options.parser.text);
//   }),
//
//   // Data parser
//   renaissance(ctx => {
//     if (!ctx.options.parser.data) return;
//     return require('express-data-parser')(ctx.options.parser.data);
//   }),
//
//   // Cookie parser
//   renaissance(ctx => {
//     if (!ctx.options.parser.cookie) return;
//     let secret = ctx.options.parser.cookie.secret;
//     if (typeof secret !== 'string') secret = ctx.options.secret;
//     return require('cookie-parser')(secret);
//   })
// ];
