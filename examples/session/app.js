// Simple visit counter for the main page
const server = require('../../server');
const counter = ctx => {
  const session = ctx.req.session;
  session.views = (session.views || 0) + 1;
  ctx.res.send('' + session.views);
};
server(counter);
