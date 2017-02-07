let request = require('request');
let server = require('../server');
let { get, post, put, del } = server.router;

let port = 3000;


// Just send 'Hello world' from the server side
exports.hello = ctx => ctx.res.send('Hello 世界');

// Make sure this method is never called
exports.err = ctx => { throw new Error('This should not be called'); };


exports.launch = launch = (middle = [], opts = {}) => {
  port = port + 1 + parseInt(Math.random() * 100);
  opts = Object.assign({}, { port: port }, opts);
  return server(opts, middle);
};

exports.handler = (middle, opts = {}, servOpts) => new Promise((resolve, reject) => {
  // As they are loaded in parallel and from different files, we need to randomize it
  // The assuption here is under 100 tests/file
  launch(middle, servOpts).then(ctx => {
    let options = Object.assign({}, {
      url: 'http://localhost:' + port + '/',
      gzip: true
    }, opts);

    request(options, (err, res) => {
      ctx.close();
      if (err) {
        // console.log("Error:", err);
        return reject(err);
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        // console.log("Error:", res.statusCode, res.body);
        return reject(res);
      }
      resolve(res);
    });
  });
});

exports.getter = (middle, data = {}) => exports.handler(get('/', middle), {
  form: data
});

exports.poster = (middle, data = {}) => exports.handler(post('/', middle), {
  form: data, method: 'POST'
});
