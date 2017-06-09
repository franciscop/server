const server = require('server');
const { get } = server.router;
const { handler, getter, poster } = require('server/test');
const nocsrf = { core: { csrf: false } };

describe('join', () => {

  it('loads as a function', async () => {
    const res = await getter(() => 'Hello 世界');
    expect(res.body).toBe('Hello 世界');
  });

  it('loads as an array', async () => {
    const res = await getter([() => 'Hello 世界']);
    expect(res.body).toBe('Hello 世界');
  });

  it('has a valid context', async () => {
    const res = await getter(ctx => {
      return `${!!ctx.req}:${!!ctx.res}:${!!ctx.options}`;
    });
    expect(res.body).toBe('true:true:true');
  });

  it('loads as a relative file', async () => {
    const res = await handler('./test/a.js');
    expect(res.body).toBe('世界');
  });
});




describe('Full trip request', () => {
  it('can perform a simple get', async () => {
    const res = await getter(() => 'Hello 世界');
    expect(res.body).toBe('Hello 世界');
  });

  it('can perform a simple get', async () => {
    const res = await getter(() => 'Hello 世界');
    expect(res.body).toBe('Hello 世界');
  });

  it('loads as an array', async () => {
    const res = await getter([() => 'Hello 世界']);
    expect(res.body).toBe('Hello 世界');
  });

  it('can perform a simple post', async () => {
    const reply = ctx => 'Hello ' + ctx.req.body.a;
    const res = await poster(reply, { a: '世界' }, nocsrf);
    expect(res.body).toBe('Hello 世界');
  });

  it('can set headers', async () => {
    const middle = get('/', ctx => {
      ctx.res.header('Expires', 12345);
      return 'Hello 世界';
    });
    const res = await handler(middle);
    expect(res.request.method).toBe('GET');
    expect(res.headers.expires).toBe('12345');
    expect(res.body).toBe('Hello 世界');
  });
});
