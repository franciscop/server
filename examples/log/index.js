const server = require('../../');
const { json } = server.reply;

server(ctx => {
  console.log(ctx);
}, ctx => 'Hello!');
