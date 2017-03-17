const extend = require('extend');
const loadware = require('loadware');
const join = require('../join');
const { get, error } = require('./index');
const { handler, getter } = require('../../tests/helpers');


const createCtx = (opts = {}) => extend({
  req: { url: '/', path: '/', method: 'GET' },
  res: {},
  options: {}
}, opts);

describe('router with promises', () => {

  it('works?', () => {
    const middles = [
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
    const middles = [
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
    const ctx = createCtx();
    ctx.req.path = '/test/francisco/presencia/bla';
    get('/test/:name/:lastname/bla')(ctx).then(ctx => {
      expect(ctx.req.solved).toBe(true);
      expect(ctx.req.params.name).toBe('francisco');
      expect(ctx.req.params.lastname).toBe('presencia');
      done();
    });
  });
});



describe('Error routes', () => {
  it('can catch errors', () => {
    const generate = ctx => { throw new Error('Should be caught'); };
    const handle = error(ctx => ctx.res.send('Error 世界'));
    return getter([generate, handle]).then(res => {
      expect(res.body).toBe('Error 世界');
    });
  });

  it('can catch errors with full path', () => {
    const generate = ctx => ctx.throw('test:a');
    const handle = error('test:a', ctx => {
      expect(ctx.error).toBeInstanceOf(Error);
      expect(ctx.error.message).toBe('test:a');
      ctx.res.send('Error 世界');
    });
    return getter([generate, handle]).then(res => {
      expect(res.body).toBe('Error 世界');
    });
  });

  it('can catch errors with partial path', () => {
    const generate = ctx => ctx.throw('test:b');
    const handle = error('test', ctx => {
      expect(ctx.error).toBeInstanceOf(Error);
      expect(ctx.error.message).toBe('test:b');
      ctx.res.send('Error 世界');
    });
    return getter([generate, handle]).then(res => {
      expect(res.body).toBe('Error 世界');
    });
  });

  const errors = {
    'test:pre:1': new Error('Hi there 1'),
    'test:pre:a': new Error('Hi there a'),
    'test:pre:b': new Error('Hi there b'),
    'test:pre:build': opts => new Error(`Hi there ${opts.name}`)
  };

  it('can generate errors', () => {
    const generate = ctx => ctx.throw('test:pre:1');
    const handle = error('test', ctx => {
      expect(ctx.error).toBeInstanceOf(Error);
      expect(ctx.error.message).toBe('Hi there 1');
      ctx.res.send();
    });
    return getter([generate, handle], {}, { errors });
  });

  it('can generate errors with options', () => {
    const generate = ctx => ctx.throw('test:pre:build', { name: 'ABC' });
    const handle = error('test', ctx => {
      expect(ctx.error).toBeInstanceOf(Error);
      expect(ctx.error.message).toBe('Hi there ABC');
      ctx.res.send();
    });
    return getter([generate, handle], {}, { errors });
  });

  it('can generate errors', () => {
    const generate = ctx => ctx.throw('generic error');
    const handle = error('generic error', ctx => {
      expect(ctx.error).toBeInstanceOf(Error);
      expect(ctx.error.message).toBe('generic error');
      ctx.res.send();
    });
    return getter([generate, handle], {}, { errors });
  });
});
