const server = require('server');
const req = require('request-promise-native');
const request = opts => {
  opts = typeof opts === 'string' ? { uri: opts } : opts;
  return req(Object.assign({}, opts, { resolveWithFullResponse: true }));
}
const { get, error } = server.router;
const { handler, getter, port } = require('./helpers');

const hello = ctx => ctx.res.send('Hello 世界');

const wait = time => new Promise((resolve, reject) => setTimeout(resolve, time));

// Make a request to the right port, get the response and close the connection
const autorequest = ctx => request(`http://localhost:${ctx.options.port}/`)
  .then(res => { ctx.close(); return res; });

describe('Middleware', () => {
  it('loads as a function', async () => {
    const res = await getter(ctx => ctx.res.send('Hello 世界'));
    expect(res.body).toBe('Hello 世界');
  });

  it('loads as an array', async () => {
    const res = await getter([ctx => ctx.res.send('Hello 世界')]);
    expect(res.body).toBe('Hello 世界');
  });

  // it('loads as an array in the first parameter', () => {
  //   // After others have finished
  //   return wait(1000).then(() => {
  //     server([hello]).then(autorequest).then(res => {
  //       expect(res.body).toBe('Hello 世界');
  //     });
  //   });
  // });

  it('has a valid context', async () => {
    const res = await getter(({ req, res, options }) => {
      res.send(`${!!req}:${!!options}`);
    });
    expect(res.body).toBe('true:true');
  });

  it('loads as a relative file', async () => {
    const res = await handler('./tests/a.js');
    expect(res.body).toBe('世界');
  });
});
