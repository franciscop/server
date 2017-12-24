const run = require('server/test/run');

describe('compress', () => {
  it('works with the defaults', async () => {
    const res = await run(() => 'Hello world').get('/');
    expect(res.body).toBe('Hello world');
  });

  it('works with an empty option object', async () => {
    const res = await run({ compress: {} }, () => 'Hello world').get('/');
    expect(res.body).toBe('Hello world');
  });

  it('works without compress', async () => {
    const res = await run({ compress: false }, () => 'Hello world').get('/');
    expect(res.body).toBe('Hello world');
  });
});
