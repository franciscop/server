const request = require('request-promises');
const supertest = require('supertest');
const server = require('../server');
const { get, post, put, del, error } = server.router;

// Get an unused port in the user range (2000 - 10000)
const ports = [];
const port = (i = 0) => {
  const port = 2000 + parseInt(Math.random() * 8000);
  // Already exists => keep doing this
  if (i >= 1000) return console.log("Ports finished!");
  if (port in ports) return port(i + 1);
  ports.push(port);
  return port;
}
exports.port = port;


// Just send 'Hello world' from the server side
exports.hello = ctx => ctx.res.send('Hello 世界');

// Make sure this method is never called
exports.err = ctx => { throw new Error('This should not be called'); };


exports.launch = launch = (middle = [], opts = {}) => {
  opts = Object.assign({}, { port: port() }, opts);
  return server(opts, middle);
};

exports.handler = async (middle, opts = {}, servOpts) => {
  // As they are loaded in parallel and from different files, we need to randomize it
  // The assuption here is under 100 tests/file
  const ctx = await launch(middle, servOpts);

  const options = Object.assign({}, {
    url: 'http://localhost:' + ctx.options.port + (opts.path || '/'),
    gzip: true
  }, opts);

  delete options.path;

  try {
    const res = await request(options);
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw new Error(`Invalid response code: ${res.statusCode}`);
    }
    ctx.close();
    return res;
  } finally {
    ctx.close();
  }
};

exports.getter = (middle, data = {}, opts) => exports.handler(get('/', middle), {
  form: data
}, opts);

exports.poster = (middle, data = {}, opts) => exports.handler(post('/', middle), {
  form: data, method: 'POST'
}, opts);



// Keep passing the same cookies (to keep the session)
function cookies (res) {
  if (!res) return '';
  return res.headers['set-cookie'].map(function (cookies) {
    return cookies.split(';')[0]
  }).join(';')
}

const req = {};
// Keep a persistent requests
req.get = (path, fn = (() => {})) => ctx => {
  let sofar = supertest(ctx.server).get(path);
  if (ctx.prev) sofar = sofar.set('Cookie', cookies(ctx.prev));
  return sofar.then(res => {
    fn(res);
    ctx.prev = res;
    return ctx;
  });
};

exports.req = req;
exports.cookies = cookies;

// Handle a function that expects to be thrown
exports.throws = async (cb, err = false) => {
  try {
    const res = await cb();
  } catch(err) {
    if (!(err instanceof Error)) {
      throw new Error('A non-error was thrown: ' + err);
    }
    return err;
  }
  throw new Error('No error was thrown');
};
