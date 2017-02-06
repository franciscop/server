const express = require('express');
const loadware = require('loadware');
const modern = require('./modern');
const compat = require('./compat');

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
  // console.log("Len:", ...loadware(args).filter(one => one).map(compat({ options: {} })));
  router[method](path, ...loadware(args).filter(one => one).map(compat));
  return modern(router);
}

module.exports = new Proxy({}, {
  get: (orig, key) => (...args) => {
    if (key === 'join') return join(...args);
    return createRouter(key, ...args);
  }
});
