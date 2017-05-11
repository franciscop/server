const server = require('../../server');
const { socket } = server.router;

server(3000,
  socket('message', ctx => {
    ctx.socket.emit('message', 'Hello there');
  });
);
