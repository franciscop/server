var server = require('./server');

server(3000);

server({ port: 3000 });

server({
  port: 3000,
  public: './public'
});

// The same for this situation
server(3000, router);
server(3000, { router: router });

// However, we use the object notation to overwrite or remove a default middleware
server(3000, { bodyparser: coolerBodyParser() }, router);
server(3000, { bodyparser: false }, router);

// Recommended way of doing routing
let { get, post } = server.router;
server(3000,
  get('/user', (req, res, next) => { /* ... */ }),
  post('/user', (req, res, next) => { /* ... */ }),
  errorhandler
);
