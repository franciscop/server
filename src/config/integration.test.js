// Test runner:
const run = require('server/test/run');
const path = require('path');

const test = 'test';

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

  it('accepts several definitions of public correctly', async () => {
    const full = path.join(process.cwd(), 'test');
    const publish = ctx => ctx.options.public;

    expect((await run({
      public: test
    }, publish).get('/')).body).toBe(full);

    expect((await run({
      public: './' + test
    }, publish).get('/')).body).toBe(full);

    expect((await run({
      public: __dirname + '/../../' + test
    }, publish).get('/')).body).toBe(full);
  });
});
