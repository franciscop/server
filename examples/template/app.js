let server = require('../../server');
let { get, post } = server.router;

server(3000,
  get('/', ctx => ctx.res.render('index')),
  get('/:id', ctx => ctx.res.render('page', { page: ctx.req.params.id }))
);
