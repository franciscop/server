const config = require('./index');
//const defaults = require('./defaults');

describe('initializes', () => {
  it('is a function', () => {
    expect(config).toEqual(jasmine.any(Function));
  });

  it('can be called empty', () => {
    expect(config).not.toThrow();
    expect(config()).toEqual(jasmine.any(Object));
  });

  it('returns the correct defaults', () => {
    const opts = config();
    expect(opts.port).toBe(3000);
    expect(opts.engine).toBe('pug');
    expect(opts.verbose).toBe(false);

    // This is now a plugin:
    // expect(opts.middle.public).toBe('public');
    // expect(opts.middle.bodyParser.extended).toBe(true);
    // expect(opts.middle.session.resave).toBe(false);
    // expect(opts.middle.session.saveUninitialized).toBe(true);
    // expect(Object.keys(opts.middle.session.cookie).length).toBe(0);
  });

  it('can set port with a single param', () => {
    const opts = config(2000);
    expect(opts.port).toBe(2000);
  });

  it('can set port as an object', () => {
    const opts = config({ port: 2000 });
    expect(opts.port).toBe(2000);
  });

  it('environment wins params', () => {
    const opts = config({ demo: 'aaa' });
    expect(opts.demo).toBe('bbb');
  });

  it('environment gets to number if needed', () => {
    const opts = config({ demob: 10 });
    expect(opts.demob).toBe(5);
  });

  it('no overwritting if no environment set', () => {
    const opts = config({ democ: 10 });
    expect(opts.democ).toBe(10);
  });

  it('it accepts a secret', () => {
    expect(config({ secret: 'sdfdsgfsd' }).secret).toBe('sdfdsgfsd');
  });

  it('throws with default secret', () => {
    expect(() => config({ secret: 'your-random-string-here' })).toThrow();
  });
});


describe('plugins', () => {
  it('loads plugin config', () => {
    expect(config({}, [{ name: 'middle', options: { a: 'b' } }]).middle.a).toBe('b');
  });
  it('loads plugin config with function', () => {
    expect(config({}, [{ name: 'middle', options: opts => {
      opts.a = 'b';
      return opts;
    } }]).middle.a).toBe('b');
  });
});


describe('app', () => {
  const appify = (key, cb) => ({
    set: (name, value) => (name === key) ? cb(value) : false
  });

  it ('sets the defaults', () => {
    config({ foo: 'bar' }, [], appify('foo', value => {
      expect(value).toBe('bar');
    }));
  });

  it('sets values to the app', () => {
    config({ foo: 'bar' }, [], {
      set: (name, value) => {
        if (name === 'foo') {
          expect(value).toBe('bar');
        }
      }
    });
  });
});
