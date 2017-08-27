// Test runner:
const run = require('server/test/run');

describe('Basic router types', () => {
  // TODO: fix this
  it('has independent options', async () => {
    const res = await Promise.all([
      run({ public: 'right' }, ctx => new Promise(resolve => {
        setTimeout(() => {
          ctx.res.send(ctx.options.public);
          resolve();
        }, 1000);
      })).get('/'),
      run({ public: 'wrong' }, ctx => ctx.options.public).get('/')
    ]);

    expect(res[0].body).toMatch(/right/);
    expect(res[1].body).toMatch(/wrong/);
  });
});
