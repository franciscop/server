const test = require('server/test');

const favicon = 'test/logo.png';

describe('Default modules', () => {
  it('favicon', async () => {
    const res = await test({ favicon }).get('/favicon.ico');
    expect(res.headers['content-type']).toBe('image/x-icon');
  });

  // TODO: test for non-existing

  // TODO: test different locations

  // TODO: test for env
});
