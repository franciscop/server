const test = require('server/test');

describe('compress', () => {
  it('works with the defaults', async () => {
    const res = await test(() => 'Hello world').get('/');
    expect(res.body).toBe('Hello world');
  });

  it('works with an empty option object', async () => {
    const res = await test({ compress: {} }, () => 'Hello world').get('/');
    expect(res.body).toBe('Hello world');
  });

  it('works without compress', async () => {
    const res = await test({ compress: false }, () => 'Hello world').get('/');
    expect(res.body).toBe('Hello world');
  });
});
