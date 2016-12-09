let server = require('../../server');
let { socket } = server.router;

server(3000,
  socket('message', (req, res) => {
    res.socket('Hello there');
  });
);
