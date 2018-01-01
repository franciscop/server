const server = require('../../server');
const { get, socket } = server.router;
const { render } = server.reply;

server(
  get('/', ctx => {
    ctx.session.counter = ctx.session.counter || 0;
    return render('index.html');
  }),
  socket('connect', ctx => {

    // Emit an event every second with +1 on the session
    setInterval(() => {

      // Increment the counter
      ctx.session.counter++;

      // For socket.io you need to manually save it
      ctx.session.save();

      // Send the value to the currently connected socket
      ctx.socket.emit('message', ctx.session.counter);
    }, 1000);
  })
);
