const server = require('../../server');

const { get, socket } = server.router;
const { render } = server.reply;

module.exports = server([
  get('/', ctx => render('index.html')),

  socket('connect', ctx => {
    console.log('Connected');
  }),

  socket('disconnect', ctx => {
    console.log('Disconnected');
  }),

  socket('hello', ctx => {
    console.log('Ping;', ctx.data);
    ctx.io.emit('there');
  }),

  get('/favicon.ico', () => 404)
]);
