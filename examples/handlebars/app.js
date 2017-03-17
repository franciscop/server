const server = require('../../server');
const { get, post } = server.router;

server(//{ engine: 'hbs' },
  get('/', ctx => ctx.res.render('index.hbs')),
  get('/:id', ctx => ctx.res.render('page.hbs', { page: ctx.req.params.id }))
);
