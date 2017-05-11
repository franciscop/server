const server = require('../../server');
const { get, post } = server.router;

server(3000, get('/', ctx => 'Hello 3000'));
server(4000, get('/', ctx => 'Hello 4000'));
