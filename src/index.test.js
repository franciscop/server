// Test runner:
const run = require('server/test/run');

describe('Default modules', () => {
  it('can log the context', async () => {
    const res = await run(ctx => {

      try {
        require('util').inspect(ctx);
      } catch (err) {
        return err.message;
      }
      return 'Good!';
    }).get('/');
    expect(res.body).toBe('Good!');
  });
});
