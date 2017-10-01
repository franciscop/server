// Test runner:
const run = require('server/test/run');

const server = require('server');
const { get } = server.router;
const nocsrf = { security: false };

describe('join', () => {

  it('loads as a function', async () => {
    const res = await run(() => 'Hello 世界').get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('loads as an array', async () => {
    const res = await run([() => 'Hello 世界']).get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('has a valid context', async () => {
    const res = await run(ctx => {
      return `${!!ctx.req}:${!!ctx.res}:${!!ctx.options}`;
    }).get('/');
    expect(res.body).toBe('true:true:true');
  });

  it('loads as a relative file', async () => {
    const res = await run('./test/a.js').get('/');
    expect(res.body).toBe('世界');
  });
});




describe('Full trip request', () => {
  it('can perform a simple get', async () => {
    const res = await run(() => 'Hello 世界').get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('uses the first reply', async () => {
    const res = await run([() => 'Hello 世界', () => 'Hello mundo']).get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('loads as an array', async () => {
    const res = await run([() => 'Hello 世界']).get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('can perform a simple post', async () => {
    const replyBody = ctx => `Hello ${ctx.data.a}`;
    const res = await run(nocsrf, replyBody).post('/', { body: { a: '世界' } });
    expect(res.body).toBe('Hello 世界');
  });

  it('can set headers', async () => {
    const middle = get('/', ctx => {
      ctx.res.header('Expires', 12345);
      return 'Hello 世界';
    });
    const res = await run(middle).get('/');
    expect(res.request.method).toBe('GET');
    expect(res.headers.expires).toBe('12345');
    expect(res.body).toBe('Hello 世界');
  });
});
