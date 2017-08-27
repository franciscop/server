const run = require('server/test/run');

describe('final', () => {
  it('gets called with an unhandled error', async () => {
    const simple = () => { throw new Error('Hello'); };
    const res = await run(simple).get('/');
    expect(res.statusCode).toBe(500);
  });

  it('does not reply if the headers are already sent', async () => {
    const simple = ctx => {
      ctx.res.send('Error 世界');
      throw new Error('Hello');
    };
    const res = await run(simple).get('/');
    expect(res.body).toBe('Error 世界');
  });
});
