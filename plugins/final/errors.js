const error = require('../../error')('/plugin/final/');

error.noreturn = `
Your middleware did not return anything to the user. This normally happens when no route was matched or if the router did not reply with anything.

This won't return anything:

~~~
// BAD
server(ctx => {
  console.log('Hello world');
});
~~~

Make sure that something is returned from your middlware so a reply is sent to the user:

~~~
// GOOD:
// Return with an arrow function
server(ctx => 'Hello world');

// Return with a explicit return
server(ctx => {
  // ...
  return 'Hello world';
});

// Return a simple status code:
server(ctx => 200);
~~~

Read the full documentation for reply here:
https://serverjs.io/documentation/reply/
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
