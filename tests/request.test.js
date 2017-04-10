const request = require('request-promise-native');
const server = require('../server');
const { get, post, put, del, error } = server.router;
const { handler, getter, poster } = require('./helpers');
const nocsrf = { connect: { csrf: false } };

const routes = [
  get('/', ctx => ctx.res.send('Hello 世界')),
  post('/', ctx => ctx.res.send('Hello ' + ctx.req.body.a)),
];

describe('Full trip request', () => {
  it('can perform a simple get', () => {
    return getter(ctx => ctx.res.send('Hello 世界')).then(res => {
      expect(res.body).toBe('Hello 世界');
    });
  });

  it('loads as an array', async () => {
    const res = await getter([ctx => ctx.res.send('Hello 世界')]);
    expect(res.body).toBe('Hello 世界');
  });

  it('can perform a simple post', () => {
    const reply = ctx => ctx.res.send('Hello ' + ctx.req.body.a);
    return poster(reply, { a: '世界' }, nocsrf).then(res => {
      expect(res.body).toBe('Hello 世界');
    });
  });

  it('can set headers', () => {
    const middle = get('/', ctx => {
      ctx.res.header('Expires', 12345);
      ctx.res.send('Hello 世界');
    });
    return handler(middle).then(res => {
      expect(res.request.method).toBe('GET');
      expect(res.headers.expires).toBe('12345');
      expect(res.body).toBe('Hello 世界');
    });
  });
});
