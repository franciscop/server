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

  // Allow to call the response straight in the router:
  //   get('/').send('Hello 世界')
  ['send', 'render', 'json', 'file'].forEach(reply => {
    router[reply] = (...args) => createRouter(method, path, (req, res) => {
      if (reply === 'file') reply = 'sendFile';
      res[reply](...args);
    });
  });

  return router;
}

module.exports = new Proxy({}, {
  get: (orig, key) => (...args) => {
    if (key === 'join') return join(...args);
    return createRouter(key, ...args);
  }
});
