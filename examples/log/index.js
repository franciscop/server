const server = require('../../');
const { json } = server.reply;

server(ctx => {
  ctx.log.info('Hi there');
}, ctx => 'Hello!');
