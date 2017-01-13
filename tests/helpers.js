let request = require('request');
let server = require('../server');
let { get, post, put, del } = server.router;

let port = 3000;

exports.handler = (middle, opts = {}, servOpts = {}) => new Promise((resolve, reject) => {
  // As they are loaded in parallel and from different files, we need to randomize it
  // The assuption here is under 100 tests/file
  port = port + 1 + parseInt(Math.random() * 900);
  server(Object.assign({}, { port: port }, servOpts), middle).then(instance => {
    let options = Object.assign({}, { url: 'http://localhost:' + port + '/', gzip: true }, opts);
    request(options, (err, res) => {
      instance.close();
      if (err) {
        console.log("Error:", err);
        return reject(err);
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        console.log("Error:", res.statusCode, res.body);
        return reject(res);
      }
      resolve(res);
    });
  }).catch(err => { throw err; });
});

exports.getter = (middle, data = {}) => exports.handler(get('/', middle), {
  form: data
});

exports.poster = (middle, data = {}) => exports.handler(post('/', middle), {
  form: data, method: 'POST'
});
