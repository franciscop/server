const server = require('../../');
const { status } = server.reply;
const { get } = server.router;

server(
  // This should get invoked for every request
  // An alternative syntax would be to support Regular Expressions.
  get('*', (ctx) => {
    return status(200);
  })
);
