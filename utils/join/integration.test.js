const server = require('server');
const { get } = server.router;
const test = require('server/test');


describe('join', () => {

  it('loads as a function', async () => {
    const res = await test(() => 'Hello 世界').get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('loads as an array', async () => {
    const res = await test([() => 'Hello 世界']).get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('has a valid context', async () => {
    const res = await test(ctx => {
      return `${!!ctx.req}:${!!ctx.res}:${!!ctx.options}`;
    }).get('/');
    expect(res.body).toBe('true:true:true');
  });
});




describe('Full trip request', () => {
  it('can perform a simple get', async () => {
    const res = await test(() => 'Hello 世界').get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('uses the first reply', async () => {
    const res = await test([() => 'Hello 世界', () => 'Hello mundo']).get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('loads as an array', async () => {
    const res = await test([() => 'Hello 世界']).get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('can perform a simple post', async () => {
    const replyBody = ctx => `Hello ${ctx.data.a}`;
    const opts = { body: { a: '世界' } };
    const res = await test({ security: false }, replyBody).post('/', opts);
    expect(res.body).toBe('Hello 世界');
  });

  it('can set headers', async () => {
    const middle = get('/', ctx => {
      ctx.res.header('Expires', 12345);
      return 'Hello 世界';
    });
    const res = await test(middle).get('/');
    expect(res.request.method).toBe('GET');
    expect(res.headers.expires).toBe('12345');
    expect(res.body).toBe('Hello 世界');
  });
});
