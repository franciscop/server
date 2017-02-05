const extend = require('extend');
const loadware = require('loadware');
const join = require('../join');
const { get } = require('./index');

const createCtx = (opts = {}) => extend({
  req: { url: '/', method: 'GET' },
  res: {},
  options: {}
}, opts);

describe('router with promises', () => {

  it('works?', () => {
    let middles = [
      ctx => new Promise((resolve) => resolve()),
      get('/aaa', ctx => { throw new Error(); }),
      get('/', ctx => { ctx.res.send = 'Hello 世界'; }),
      get('/sth', ctx => { throw new Error(); }),
      get('/', ctx => { throw new Error(); })
    ];

    return join(middles)(createCtx()).then(ctx => {
      expect(ctx.req.solved).toBe(true);
      expect(ctx.res.send).toBe('Hello 世界');
    });
  });

  it('works even when wrapped with join() and loadware()', () => {
    let middles = [
      ctx => new Promise((resolve) => resolve()),
      get('/aaa', ctx => { throw new Error(); }),
      join(loadware(get('/', ctx => { ctx.res.send = 'Hello 世界'; }))),
      get('/sth', ctx => { throw new Error(); }),
      get('/', ctx => { throw new Error(); })
    ];

    // Returns the promise to be handled async
    return join(middles)(createCtx()).then(ctx => {
      expect(ctx.req.solved).toBe(true);
      expect(ctx.res.send).toBe('Hello 世界');
    });
  });


  it('still works?', done => {
    let ctx = createCtx();
    ctx.req.url = '/test/francisco/presencia/bla';
    get('/test/:name/:lastname/bla')(ctx).then(ctx => {
      expect(ctx.req.solved).toBe(true);
      expect(ctx.req.params.name).toBe('francisco');
      expect(ctx.req.params.lastname).toBe('presencia');
      done();
    });
  });
});
