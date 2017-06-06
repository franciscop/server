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

  // Add a reference from ctx.req.body to the ctx.data
  parser.before.push(ctx => { ctx.data = ctx.req.body; });

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
