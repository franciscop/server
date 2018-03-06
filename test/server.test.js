// Test runner:
const test = require('server/test');

describe('Default modules', () => {
  it('can log the context', async () => {
    const res = await test(ctx => {
      try {
        require('util').inspect(ctx);
      } catch (err) {
        return err.message;
      }
      return 'Good!';
    }).get('/');
    expect(res.body).toBe('Good!');
  }, 50000);
});
