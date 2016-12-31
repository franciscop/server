let express = require('express');
let loadware = require('loadware');

module.exports = new Proxy({}, {
  get: (orig, key) => (...args) => {
    let router = express.Router();
    router[key](...args);
    return router;
  }
});

module.exports.join = (...middles) => {
  let router = express.Router();
  loadware(middles).forEach(middle => {
    router.use(middle);
  });
  return router;
}
