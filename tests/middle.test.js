const server = require('server');
const req = require('request-promise-native');
const request = opts => {
  opts = typeof opts === 'string' ? { uri: opts } : opts;
  return req(Object.assign({}, opts, { resolveWithFullResponse: true }));
}
const { get, error } = server.router;
const { handler, getter, port } = require('./helpers');

const auto = require('./auto.js');

const hello = ctx => ctx.res.send('Hello 世界');

describe('Middleware', () => {

  it('loads as a function', async () => {
    const res = await getter(ctx => ctx.res.send('Hello 世界'));
    expect(res.body).toBe('Hello 世界');
  });

  it('loads as an array', async () => {
    const res = await getter([ctx => ctx.res.send('Hello 世界')]);
    expect(res.body).toBe('Hello 世界');
  });

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
