let server = require('../../server');
let { get, post } = server.router;

server({
  port: 3000,
  'view engine': 'hbs'
},
  get('/', ctx => ctx.res.render('index')),
  get('/:id', ctx => ctx.res.render('page', { page: ctx.req.params.id }))
);
