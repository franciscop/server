const server = require('../../server');
const { get, socket } = server.router;
const { render } = server.reply;

server(
  get('/', () => render('index.html')),
  socket('connect', ctx => {
    setInterval(() => {
      ctx.session.counter = (ctx.session.counter || 0) + 1;
      ctx.socket.emit('message', ctx.session.counter);
    }, 1000);
  })
);
