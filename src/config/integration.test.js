const test = require('server/test');
const path = require('path');

describe('Basic router types', () => {
  it('has independent options', async () => {
    const res = await Promise.all([
      test({ public: 'right' }, async ctx => {
        await test.wait(1000);
        return ctx.options.public;
      }).get('/'),
      test({ public: 'wrong' }, ctx => ctx.options.public).get('/')
    ]);

    expect(res[0].body).toMatch(/right/);
    expect(res[1].body).toMatch(/wrong/);
  }, 50000);

  it('accepts several definitions of public correctly', async () => {
    const full = path.join(process.cwd(), 'test');
    const publish = ctx => ctx.options.public;

    expect((await test({
      public: 'test'
    }, publish).get('/')).body).toBe(full);

    expect((await test({
      public: './test'
    }, publish).get('/')).body).toBe(full);

    expect((await test({
      public: __dirname + '/../../test'
    }, publish).get('/')).body).toBe(full);
  });
});
