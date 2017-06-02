const { handler, getter } = require('server/test');

describe('Middleware', () => {

  it('loads as a function', async () => {
    const res = await getter(() => 'Hello 世界');
    expect(res.body).toBe('Hello 世界');
  });

  it('loads as an array', async () => {
    const res = await getter([() => 'Hello 世界']);
    expect(res.body).toBe('Hello 世界');
  });

  it('has a valid context', async () => {
    const res = await getter(({ req, res, options }) => {
      return `${!!req}:${!!res}:${!!options}`;
    });
    expect(res.body).toBe('true:true:true');
  });

  it('loads as a relative file', async () => {
    const res = await handler('./test/a.js');
    expect(res.body).toBe('世界');
  });
});
