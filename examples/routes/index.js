const server = require('../../server');
const { get, post } = server.router;

server([
  get('/', ctx => 'Hello 世界'),
  get('/page', ctx => 'Hello page')
]);
