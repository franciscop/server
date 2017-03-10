const server = require('../../server');
const { get, post } = server.router;

server([
  get('/', ctx => ctx.res.send('Hello 世界')),
  get('/page', ctx => ctx.res.send('Hello page'))
]);
