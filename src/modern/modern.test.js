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
  it('returns a promise when called', () => {
    expect(modern(middle)(ctx) instanceof Promise).toBe(true);
  });

  it('requires the context to be called', async () => {
    expect(modern(middle)()).rejects.toBeDefined();
  });

  it('rejected with empty context', async () => {
    expect(modern(middle)({})).rejects.toBeDefined();
  });

  it('rejected without res', async () => {
    expect(modern(middle)({ req: {} })).rejects.toBeDefined();
  });

  it('rejected without req', async () => {
    expect(modern(middle)({ res: {} })).rejects.toBeDefined();
  });
});



describe('Middleware handles the promise', () => {
  it('resolves when next is called empty', async () => {
    await modern((req, res, next) => next())(ctx);
  });

  it('cannot handle error middleware', async () => {
    // eslint-disable-next-line no-unused-vars
    expect(() => modern((err, req, res, next) => {})).toThrow();
  });

  it('keeps the context', async () => {
    const ctx = { req: 1, res: 2 };
    await modern((req, res, next) => next())(ctx);
    expect(ctx.req).toBe(1);
    expect(ctx.res).toBe(2);
  });

  it('can modify the context', async () => {
    const middle = (req, res, next) => {
      req.user = 'myname';
      res.send = 'sending';
      next();
    };
    const ctx = { req: {}, res: {} };
    await modern(middle)(ctx);
    expect(ctx.req.user).toBe('myname');
    expect(ctx.res.send).toBe('sending');
  });

  it('has chainable context', async () => {
    const ctx = { req: { user: 'a' }, res: { send: 'b' } };
    const middle = (req, res, next) => {
      req.user += 1;
      res.send += 2;
      next();
    };
    await modern(middle)(ctx).then(() => modern(middle)(ctx));
    expect(ctx.req.user).toBe('a11');
    expect(ctx.res.send).toBe('b22');
  });

  it('factory can receive options', async () => {

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

    await join(middles)(ctx);
    expect(ctx.req.user).toBe('a111111');
    expect(ctx.res.send).toBe('b111111');
  });

  it('rejects when next is called with an error', async () => {
    const wrong = (req, res, next) => next(new Error('Custom error'));
    expect(modern(wrong)(ctx)).rejects.toBeDefined();
  });

  it('does not resolve nor reject if next is not called', async () => {
    modern(() => {})(ctx).then(() => {
      expect('It was resolved').toBe(false);
    }).catch(() => {
      expect('It was rejected').toBe(false);
    });
    return new Promise(resolve => {
      setTimeout(() => resolve(), 1000);
    });
  });
});
