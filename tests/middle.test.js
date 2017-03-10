const server = require('server');
const req = require('request-promise-native');
const request = opts => {
  opts = typeof opts === 'string' ? { uri: opts } : opts;
  return req(Object.assign({}, opts, { resolveWithFullResponse: true }));
}
const { get, error } = server.router;
const { handler, getter } = require('./helpers');

const hello = ctx => ctx.res.send('Hello 世界');
const randPort = ctx => ctx.options.port = 2000 + parseInt(Math.random() * 10000);

const wait = time => new Promise((resolve, reject) => setTimeout(resolve, time));

// Make a request to the right port, get the response and close the connection
const autorequest = ctx => request(`http://localhost:${ctx.options.port}/`)
  .then(res => { ctx.close(); return res; });

describe('Middleware', () => {
  it('loads as a function', done => {
    getter(ctx => ctx.res.send('Hello 世界')).then(res => {
      expect(res.body).toBe('Hello 世界');
      done();
    });
  });

  it('loads as an array', done => {
    getter([ctx => ctx.res.send('Hello 世界')]).then(res => {
      expect(res.body).toBe('Hello 世界');
      done();
    });
  });

  // NOTE: port has to be changed for parallel tests
  it('loads as an function in the first parameter', () => {
    server.plugins.push({ init: ctx => {
      ctx.options.port = 2000 + parseInt(Math.random() * 10000);
    }});
    return server(hello).then(autorequest).then(res => {
      expect(res.body).toBe('Hello 世界');
    });
  });

  it('loads as an array in the first parameter', () => {
    // After others have finished
    return wait(1000).then(() => {
      server([hello]).then(autorequest).then(res => {
        expect(res.body).toBe('Hello 世界');
      });
    });
  });

  it('has a valid context', () => {
    return getter(ctx => {
      ctx.res.send('Hello');
      expect(ctx.req).toBeDefined();
      expect(ctx.res).toBeDefined();
      expect(ctx.options).toBeDefined();
    });
  });

  it('loads as a relative file', done => {
    handler('./tests/a.js').then(res => {
      expect(res.body).toBe('世界');
      done();
    });
  });
});
