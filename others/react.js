// React server-side rendering
// Server-side rendering
const server = require('server');
const { get, post } = server.router;

server.plugin('react');

server(get('/', ctx => {
  ctx.res.render('./components/app.jsx', { a: 'b' });
));
