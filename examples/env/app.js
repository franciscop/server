const server = require('../../server');

server({
  port: 3000,
  random_variable: 'a'
}).then(ctx => {
  console.log(ctx.options.port, ctx.options.random_variable);
});
