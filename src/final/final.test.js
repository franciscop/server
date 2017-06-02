const { getter, throws } = require('../../test');

describe('final', () => {
  it('gets called with an unhandled error', async () => {
    const simple = () => { throw new Error('Hello'); };
    const err = await throws(() => getter(simple, {}, { log: 'critical' }));
    expect(err.message).toMatch(/500/);
  });

  it('does not reply if the headers are already sent', async () => {
    const simple = ctx => {
      ctx.res.send('Error 世界');
      throw new Error('Hello');
    };
    const res = await getter(simple, {}, { log: 'critical' });
    expect(res.body).toBe('Error 世界');
  });

  it('testing', async () => {
    const res = await getter(() => 'Hello 世界');
    expect(res.body).toBe('Hello 世界');
  });
});
