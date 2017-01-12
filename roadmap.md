# Roadmap

Wish list and features.



## Version 1.1

Integration with websockets as middleware:

```js
server({}, [

  // These come from user-events
  socket('join', (data, socket, io) => io.emit('join', data)),
  socket('message', (data, socket, io) => io.emit('message', data)),

  // These are from the native events
  socket('connect', (socket, io) => { /* ... */ }),
  socket('disconnect', (socket, io) => { /* ... */ })
]);
```

This will require some serious handling, but in exchange will make websockets easily accessible by everyone.



## Version 1.0

> This is being rushed because NPM asked me to publish 1.x as there were already 0.x version from other person, so version 1.0 will be published with few alphas/betas

Retrieve the old functionality of Express to make it easy to launch a server in Node.js

Todo:

- Include all of the libraries
- Testing testing and more testing
- Good documentation and [tutorials in Libre University](https://en.libre.university/subject/4kitSFzUe)
- Make sure that the express-session is secure with the secret

Done:

- Created the base
- Implemented some of the libraries
- Use it in real-world projects
