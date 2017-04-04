const server = require('../../server');
const { getter, throws } = require('../../tests/helpers');

describe('final', () => {
  it('gets called with an unhandled error', async () => {
    const simple = () => { throw new Error('Hello'); };
    const err = await throws(() => getter(simple));
    expect(err.message).toMatch(/500/);
  });

  it('doesn not reply if the headers are already sent', async () => {
    const simple = ctx => {
      ctx.res.send('Error 世界');
      throw new Error('Hello');
    };
    const res = await getter(simple);
    expect(res.body).toBe('Error 世界');
  });
});
