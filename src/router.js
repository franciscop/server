let express = require('express');
let loadware = require('loadware');

let join = (...middles) => {
  let router = express.Router();
  loadware(middles).forEach(middle => {
    router.use(middle);
  });
  return router;
}


// TODO: allow concatenation of some as `status()`
const createRouter = (method, path, ...args) => {
  if (method === 'del') method = 'delete';
  let router = express.Router();
  router[method](path, ...args);

  // This is only experimental right now
  if (process.env.EXPERIMENTAL === '1') {
    // Allow to call the response straight in the router:
    //   get('/').send('Hello 世界')
    ['append', 'attachment', 'cookie', 'clearCookie', 'download', 'end', 'file',
      'format', 'json', 'jsonp', 'links', 'location', 'redirect', 'render',
      'send', 'sendFile', 'sendStatus', 'status', 'status', 'type', 'vary'
    ].forEach(type => {
      router[type] = router[type] || ((...extra) => createRouter(method, path, ...args, (req, res, next) => {
        if (type === 'file') type = 'sendFile';
        res[type](...extra);
        if (!res.headersSent) {
          next();
        }
      }));
    });
  }

  return router;
}

module.exports = new Proxy({}, {
  get: (orig, key) => (...args) => {
    if (key === 'join') return join(...args);
    return createRouter(key, ...args);
  }
});
