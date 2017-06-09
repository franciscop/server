const server = require('../../server');
const { socket } = server.router;

server(
  socket('message', ctx => {
    ctx.socket.emit('message', 'Hello there');
  })
);
