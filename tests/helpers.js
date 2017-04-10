const request = require('request-promises');
const supertest = require('supertest');
const server = require('../server');
const port = require('./helpers/port');
const { get, post, put, del, error } = server.router;

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

exports.getter = (middle, data = {}, opts, path = '/') => exports.handler(get(path, middle), {
  form: data
}, opts);

exports.poster = (middle, data = {}, opts) => exports.handler(post('/', middle), {
  form: data, method: 'POST'
}, opts);



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
