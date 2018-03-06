const config = require('./index');

describe('options', () => {
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
    await expect(opts).rejects.toHaveProperty('code', '/server/options/noarg');
  });
});
