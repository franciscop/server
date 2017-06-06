# Roadmap

Wish list and features. Totally tentative, but nothing set in stone.


## Version 1.2

Passport integration. Performance.


## Version 1.1

Making Plugin API. Integrate websockets:

```js
let server = require('server');
let { socket } = server.router;

server({}, [

  // These come from user-events
  socket('join', ctx => ctx.io.emit('join', ctx.data)),
  socket('message', ctx => ctx.io.emit('message', ctx.data)),

  // These are from the native events
  socket('connect', ctx => { /* ... */ }),
  socket('disconnect', ctx => { /* ... */ })
]);
```

This will require some serious handling, but in exchange will make websockets easily accessible to everyone.



## Version 1.0

> This is being rushed because NPM asked me to publish 1.x as there were already 0.x version from other person, so version 1.0 will be published with few alphas/betas

Retrieve the old functionality of Express to make it easy to launch a server in Node.js

Todo:

- Testing testing and more testing
- Good documentation and [tutorials in Libre University](https://en.libre.university/subject/4kitSFzUe)

Done:

- Include all of the libraries
- Created the base
- Implemented some of the libraries
- Use it in real-world projects
- Make sure that the express-session is secure with the secret (session usage depend on whether the token is provided or not)
