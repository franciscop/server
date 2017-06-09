const server = require('../../server');
const { get, post } = server.router;
const { render } = server.reply;

server(
  get('/', ctx => render('index')),
  get('/:id', ctx => render('page', { page: ctx.req.params.id }))
);
