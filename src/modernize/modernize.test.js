const modern = require('./index');
const middle = (req, res, next) => { next() };
const ctx = { req: {}, res: {} };

describe('initializes', () => {
  it('returns a function', () => {
    expect(typeof modern(middle)).toBe('function');
  });

  it('the returned modern middleware has 1 arg', () => {
    expect(modern(middle).length).toBe(1);
  });

  it('requires an argument', () => {
    expect(() => modern()).toThrow();
  });

  it('a non-function argument throws', () => {
    expect(() => modern(true)).toThrow();
    expect(() => modern(5)).toThrow();
    expect(() => modern('')).toThrow();
    expect(() => modern([])).toThrow();
    expect(() => modern({})).toThrow();

    expect(() => modern(() => {})).not.toThrow();
  });
});



describe('call the middleware', () => {
  it('requires the context to be called', done => {
    modern(middle)().catch(err => { done(); });
  });

  it('returns a promise when called', () => {
    expect(modern(middle)(ctx) instanceof Promise).toBe(true);
  });

  it('rejected with empty context', done => {
    modern(middle)({}).catch(err => { done(); });
  });

  it('rejected without res', done => {
    modern(middle)({ req: {} }).catch(err => { done(); });
  });

  it('rejected without req', done => {
    modern(middle)({ res: {} }).catch(err => { done(); });
  });
});



describe('Middleware handles the promise', () => {
  it('resolves when next is called empty', done => {
    modern((req, res, next) => next())(ctx).then(() => done());
  });

  it('cannot handle error middleware', () => {
    expect(() => modern((err, req, res, next) => {})).toThrow();
  });

  it('passes the context', done => {
    let ctx = { req: 1, res: 2 };
    modern((req, res, next) => next())(ctx).then(ctx => {
      expect(ctx.req).toBe(1);
      expect(ctx.res).toBe(2);
      done();
    });
  });

  it('can modify the context', done => {
    let middle = (req, res, next) => {
      req.user = 'myname';
      res.send = 'sending';
      next();
    };
    modern(middle)({ req: {}, res: {} }).then(ctx => {
      expect(ctx.req.user).toBe('myname');
      expect(ctx.res.send).toBe('sending');
      done();
    });
  });

  it('rejects when next is called with an error', done => {
    modern((req, res, next) => next('Custom error'))(ctx).catch(err => {
      expect(err).toBe('Custom error');
      done();
    });
  });

  it('does not resolve nor reject if next is not called', done => {
    modern((req, res, next) => {})(ctx).then(ctx => {
      expect('It was resolved').toBe(false);
    }).catch(err => {
      expect('It was rejected').toBe(false);
    });
    setTimeout(() => done(), 1000);
  });
});
