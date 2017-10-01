// Test runner:
const run = require('server/test/run');
const path = require('path');

// Local helpers and data
const empty = () => 'Hello 世界';
const test = 'test';
const favicon = test + '/logo.png';

describe('Default modules', () => {

  it('favicon', async () => {
    const res = await run({ core: { favicon } }).get('/favicon.ico');
    expect(res.headers['content-type']).toBe('image/x-icon');
  });

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


  // Different instances of the same thing should have different plugins/options
  // This test is to make sure so
  // it.skip('has independent instances', async () => {
  //   const portN = port();
  //   const url = `http://localhost:${portN}/favicon.ico`;
  //
  //   // This should have all 6 middleware
  //   const req1 = handler([
  //     ctx => new Promise(resolve => {
  //       setTimeout(() => {
  //         resolve('' + ctx.plugins.filter(p => p.name === 'core')[0].before.length);
  //       }, 500);
  //     })
  //   ], { url }, { port: portN });
  //
  //   // This should have 4 middleware but not modify the previous
  //   const res2 = await handler([
  //     ctx => ctx.plugins.filter(p => p.name === 'core')[0].before.length
  //   ], { url }, { port: port(), core: { csrf: false } });
  //
  //   // This is correct even if buggy
  //   expect(res2.body).toBe('4');
  //
  //   // This would show a bug where the plugins and/or options are shared
  //   const res1 = await req1;
  //   expect(res1.body).toBe('6');
  // });

  it('response-time', async () => {
    const res = await run(empty).get('/');
    expect(res.headers['x-response-time']).toMatch(/ms$/);
  });


  // // SKIP: request() nor supertest() read gzip
  // it.skip('compress', async () => {
  //   const middle = ctx =>
  //     ctx.res.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
  //                  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
  //                  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
  //                  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  //
  //   const ctx = await launch(middle);
  //   const res = await supertest(ctx.server).get('/');
  //   // ...
  // });
});
