let express = require('express');
let loadware = require('loadware');

let join = (...middles) => {
  let router = express.Router();
  loadware(middles).forEach(middle => {
    router.use(middle);
  });
  return router;
}

module.exports = new Proxy({}, {
  get: (orig, key) => (...args) => {
    if (key === 'join') return join(...args);
    let router = express.Router();
    if (key === 'del') key = 'delete';
    router[key](...args);
    return router;
  }
});
