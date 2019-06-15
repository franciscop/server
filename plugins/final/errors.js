const error = require('../../error')('/plugin/final/');

error.noreturn = ({ method, url }) => `
Your middleware did not return anything for this request:

${method} ${url}

This normally happens when no route was matched or if the router did not reply with anything. Make sure to return something, even if it's a catch-all error.

Documentation for reply: https://serverjs.io/documentation/reply/
Relevant issue: https://github.com/franciscop/server/issues/118
`;

error.unhandled = `
Some middleware threw an error that was not handled properly. This can happen when you do this:

~~~
// BAD:
server(ctx => { throw new Error('I am an error!'); });
~~~

To catch and handle these types of errors, add a route to the end of your middlewares to handle errors like this:

~~~
// GOOD:
const { error } = server.router;
const { status } = server.reply;

server(
  ctx => { throw new Error('I am an error!'); },
  // ...
  error(ctx => status(500).send(ctx.error.message))
);
~~~

Please feel free to open an issue in Github asking for more info:
https://github.com/franciscop/server
`;

module.exports = error;
