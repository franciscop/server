const join = require('../join');
const modern = require('./index');
const middle = (req, res, next) => next();
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
    const ctx = { req: 1, res: 2 };
    modern((req, res, next) => next())(ctx).then(ctx => {
      expect(ctx.req).toBe(1);
      expect(ctx.res).toBe(2);
      done();
    });
  });

  it('can modify the context', done => {
    const middle = (req, res, next) => {
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

  it('has chainable context', done => {
    const ctx = { req: { user: 'a' }, res: { send: 'b' } };
    const middle = (req, res, next) => {
      req.user += 1;
      res.send += 2;
      next();
    };
    modern(middle)(ctx).then(modern(middle)).then(ctx => {
      expect(ctx.req.user).toBe('a11');
      expect(ctx.res.send).toBe('b22');
      done();
    });
  });

  it('factory can receive options', done => {

    // The full context
    const ctx = {
      req: { user: 'a' },
      res: { send: 'b' },
      options: { extra: 1}
    };

    // A middleware factory
    const factory = opts => {
      return (req, res, next) => {
        req.user += opts.extra;
        res.send += opts.extra;
        next();
      };
    };

    // Plain ol' middleware
    const factored = factory({ extra: 1 });

    // We need to pass it and then re-call it
    const middles = [

      // Native sync, this could be extracted to '({ req, res, options })'
      ctx => {
        ctx.req.user += ctx.options.extra;
        ctx.res.send += ctx.options.extra;
      },

      // Native async
      ctx => new Promise((resolve) => {
        ctx.req.user += ctx.options.extra;
        ctx.res.send += ctx.options.extra;
        resolve();
      }),

      // Hardcoded case:
      modern((req, res, next) => {
        req.user += 1;
        res.send += 1;
        next();
      }),

      // Using some info from the context:
      ctx => modern((req, res, next) => {
        req.user += ctx.options.extra;
        res.send += ctx.options.extra;
        next();
      })(ctx),

      // The definition might come from a factory
      ctx => modern(factory({ extra: ctx.options.extra }))(ctx),

      // The same as above but already defined
      ctx => modern(factored)(ctx)
    ];

    join(middles)(ctx).then(ctx => {
      expect(ctx.req.user).toBe('a111111');
      expect(ctx.res.send).toBe('b111111');
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
