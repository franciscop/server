const server = require('../../server');
const { get, post } = server.router;

server({ 'view engine': 'hbs' },
  get('/', ctx => ctx.res.render('index')),
  get('/:id', ctx => ctx.res.render('page', { page: ctx.req.params.id }))
);
