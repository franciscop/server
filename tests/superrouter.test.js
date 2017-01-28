const join = require('../src/join');

// Create a middleware that splits paths
const get = (path, ...promises) => ctx => {

  // Only do this if the correct path
  if (ctx.req.url !== path) return;

  // It can/should be solved only once
  if (ctx.req.solved) return;

  // Perform this promise chain
  return join(promises)(ctx).then(ctx => {
    ctx.req.solved = true;
    return ctx;
  });
};



describe('WTFamIdoing?', () => {

  it('works?', done => {
    let middles = [
      ctx => new Promise((resolve) => resolve()),
      ctx => new Promise((resolve) => resolve()),
      get('/aaa', ctx => new Promise((resolve) => {
        console.log('SHOULD NOT SHOW');
      })),
      get('/', ctx => {
        // do whatever
      }),
      get('/sth', ctx => new Promise((resolve) => {
        console.log('SHOULD NOT SHOW');
      })),
      get('/', ctx => new Promise((resolve) => {
        console.log('SHOULD NOT SHOW');
      }))
    ];

    const ctx = { req: { url: '/', method: 'GET' }, res: {}, options: {} };
    join(middles)(ctx).then(ctx => {
      expect(ctx.req.solved).toBe(true);
      done();
    }).catch(err => {
      console.log("CATCH SHOULD NOT SHOW", err);
    });
  });
});
