const server = require('../../server');
const { get, post } = server.router;
const { render } = server.reply;

server(//{ engine: 'hbs' },
  get('/', ctx => render('index.hbs')),
  get('/:id', ctx => render('page.hbs', { page: ctx.req.params.id }))
);
