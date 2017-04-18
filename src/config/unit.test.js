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
    const opts = config({ test: 'aaa' });
    expect(opts.test).toBe('bbb');
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


describe('environment variables', () => {
  it('key case is ignored', () => {
    expect(config().test00).toBe('abc');
    expect(config().test01).toBe('abc');
    expect(config().test02).toBe('abc');
    expect(config().test03).toBe('abc');
  });

  it('loads strings', () => {
    expect(config().test10).toBe('abc');
    expect(config().test11).toBe('Abc');
    expect(config().test12).toBe('AbC');
    expect(config().test13).toBe('ABC');
  });

  it('loads numbers', () => {
    expect(config().test20).toBe(10);
    expect(config().test21).toBe(-10);
    expect(config().test22).toBe(10.5);
    expect(config().test23).toBe(10e5);
  });

  it('loads booleans', () => {
    expect(config().test30).toBe(true);
    expect(config().test31).toBe(true);
    expect(config().test32).toBe(true);
    expect(config().test33).toBe(true);
  });

  it('loads objects', () => {
    expect(config().test40).toEqual({});
    expect(config().test41).toEqual([]);
    expect(config().test42).toEqual({ a: 'b' });
    expect(config().test43).toEqual(['a', 'b']);
  });

  it('ignores invalid options', () => {
    expect(config()['test x']).toBeUndefined();
  });
});



describe('plugins', () => {
  it('loads plugin config', () => {
    const plugin = { name: 'middle', options: { a: 'b' } };
    expect(config({}, [plugin]).middle.a).toBe('b');
  });
  it('loads plugin config with function', () => {
    const plugin = {
      name: 'middle',
      options: opts => { opts.a = 'b'; return opts; }
    };
    expect(config({}, [plugin]).middle).toEqual({ a: 'b' });
  });
});
