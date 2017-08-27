const config = require('./index');
//const defaults = require('./defaults');

describe('initializes', () => {
  it('is a function', async () => {
    expect(config).toEqual(jasmine.any(Function));
  });

  it('can be called empty', async () => {
    expect(config).not.toThrow();
    expect(config()).toEqual(jasmine.any(Object));
  });

  it('returns the correct defaults', async () => {
    const opts = await config();
    expect(opts.port).toBe(3000);
    expect(opts.engine).toBe('pug');
  });

  it('can set port with a single param', async () => {
    const opts = await config(2000);
    expect(opts.port).toBe(2000);
  });

  it('can set port as an object', async () => {
    const opts = await config({ port: 2000 });
    expect(opts.port).toBe(2000);
  });

  it('no overwritting if no environment set', async () => {
    const opts = await config({ democ: 10 });
    expect(opts.democ).toBe(undefined);
  });

  it('throws when secret is passed manually', async () => {
    const opts = config({ secret: 'your-random-string-here' });
    await expect(opts).rejects.toMatchObject({ code: '/server/options/noarg' });
  });
});


describe('environment variables', () => {
//   it('key case is ignored', async () => {
//     expect(await config().test00).toBe('abc');
//     expect(await config().test01).toBe('abc');
//     expect(await config().test02).toBe('abc');
//     expect(await config().test03).toBe('abc');
//   });
//
//   it('loads strings', async () => {
//     expect(await config().test10).toBe('abc');
//     expect(await config().test11).toBe('Abc');
//     expect(await config().test12).toBe('AbC');
//     expect(await config().test13).toBe('ABC');
//   });
//
//   it('loads numbers', async () => {
//     expect(await config().test20).toBe(10);
//     expect(await config().test21).toBe(-10);
//     expect(await config().test22).toBe(10.5);
//     expect(await config().test23).toBe(10e5);
//   });
//
//   it('loads booleans', async () => {
//     expect(await config().test30).toBe(true);
//     expect(await config().test31).toBe(true);
//     expect(await config().test32).toBe(true);
//     expect(await config().test33).toBe(true);
//   });
//
//   it('loads objects', async () => {
//     expect(await config().test40).toEqual({});
//     expect(await config().test41).toEqual([]);
//     expect(await config().test42).toEqual({ a: 'b' });
//     expect(await config().test43).toEqual(['a', 'b']);
//   });
//
//   it('ignores invalid options', async () => {
//     expect(await config()['test x']).toBeUndefined();
//   });
// });
//
//
// describe('errors', () => {
//   it('rejects a default secret', async () => {
//     try {
//       await config({ secret: 'your-random-string-here' });
//       throw new Error('Should not be here');
//     } catch (err) {
//       expect(err.code).toBe('/server/options/secret/example');
//       expect(err.message).toMatch(/your-random-string-here/);
//     }
//   });
// });
//
//
// describe('plugins', () => {
//   it('loads plugin config', async () => {
//     const plugin = { name: 'middle', options: { a: 'b' } };
//     expect(await config({}, [plugin]).middle.a).toBe('b');
//   });
//   it('loads plugin config with function', async () => {
//     const plugin = {
//       name: 'middle',
//       options: opts => { opts.a = 'b'; return opts; }
//     };
//     expect(await config({}, [plugin]).middle).toEqual({ a: 'b' });
//   });
});
