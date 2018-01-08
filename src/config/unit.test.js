const schema = require('./schema');
const parse = require('./parse');
const env = require('./env');

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

  it.skip('throws when secret is passed manually', async () => {
    const opts = config({ secret: 'your-random-string-here' });
    await expect(opts).rejects.toHaveProperty('code', '/server/options/noarg');
  });
});



describe('options/parse', () => {
  it('uses the defaults', async () => {
    expect(await parse(schema)).toMatchObject({ port: 3000 });
    expect(await parse(schema, {})).toMatchObject({ port: 3000 });
  });

  it('uses the __root', async () => {
    expect(await parse(schema, 2000)).toMatchObject({ port: 2000 });
  });

  it('can use a plain object', async () => {
    expect(await parse(schema, { port: 2000 })).toMatchObject({ port: 2000 });
  });

  it('can use the argument', async () => {
    const opts = await parse({ public: { arg: true } }, { public: 'abc' });
    expect(opts.public).toBe('abc');
  });

  it('can use the ENV', async () => {
    expect(await parse(schema, { port: 2000 }, { PORT: 1000 })).toMatchObject({ port: 1000 });
    expect(await parse({ port: { env: true } }, { port: 2000 }, { PORT: 1000 })).toMatchObject({ port: 1000 });
  });

  it('just works with false env and no env', async () => {
    const opts = await parse({ public: { env: false }}, { public: 'abc' });
    expect(opts.public).toBe('abc');
  });

  it('accepts required with value', async () => {
    const opts = await parse({ public: { required: true } }, { public: 'abc' });
    expect(opts.public).toBe('abc');
  });

  it('environment wins params', async () => {
    const opts = await parse(schema, { public: 'aaa' }, { PUBLIC: 'abc' });
    expect(opts.public).toMatch(/[/\\]abc/);
  });

  it('can handle several types', async () => {
    expect((await parse(schema, { public: false })).public).toBe(false);
    expect((await parse(schema, { public: 'abc' })).public).toMatch(/[/\\]abc/);
  });

  it('rejects on incorrect types', async () => {
    const pub = parse(schema, { public: 25 });
    await expect(pub).rejects.toHaveProperty('code', '/server/options/type');

    const port = parse(schema, { port: '25' });
    await expect(port).rejects.toHaveProperty('code', '/server/options/type');
  });

  it('can handle NODE_ENV', async () => {
    expect(await parse(schema, {}, { NODE_ENV: 'development' })).toMatchObject({ env: 'development' });
    expect(await parse(schema, {}, { NODE_ENV: 'test' })).toMatchObject({ env: 'test' });
    expect(await parse(schema, {}, { NODE_ENV: 'production' })).toMatchObject({ env: 'production' });
  });

  it('throws with wrong value', async () => {
    const env = parse(schema, {}, { NODE_ENV: 'abc' });
    await expect(env).rejects.toHaveProperty('code', '/server/options/enum');
  });

  it('no `__root` should be given no root', async () => {
    const env = parse({}, 'hello');
    await expect(env).rejects.toHaveProperty('code', '/server/options/notobject');
  });

  it('no `arg` should be given no arg', async () => {
    const arg = parse(schema, { env: 'abc' });
    await expect(arg).rejects.toHaveProperty('code', '/server/options/noarg');
  });

  it.skip('no `env` should be given no env', async () => {
    const env = parse({ public: { env: false }}, {}, { PUBLIC: 'hello' });
    await expect(env).rejects.toHaveProperty('code', '/server/options/noenv');
  });

  it('throws with no value for required', async () => {
    const env = parse({ public: { required: true } });
    await expect(env).rejects.toHaveProperty('code', '/server/options/required');
  });

  it('does a validation', async () => {
    const validate = () => {
      let err = new Error('Hello world');
      err.code = '/server/options/fakeerror';
      return err;
    };
    const env = parse({ public: { validate } }, {}, { PUBLIC: 'hello' });
    await expect(env).rejects.toHaveProperty('code', '/server/options/fakeerror');
  });

  it('expects the validation to return truthy', async () => {
    const opts = await parse({ public: { validate: () => true } }, { public: 'hello' });
    expect(opts.public).toBe('hello');
  });

  it('expects the validation not to return false', async () => {
    const env = parse({ public: { validate: () => false } });
    await expect(env).rejects.toHaveProperty('code', '/server/options/validate');
  });

  it('works as expected in windows', async () => {
    const env = parse({ public: { validate: () => false } });
    await expect(env).rejects.toHaveProperty('code', '/server/options/validate');
  });

  it('can be recursive with subproperties', async () => {
    const github = await parse({ github: { options: { id: { default: 5 } } } });
    expect(github).toEqual({ github: { id: 5 } });

    const github2 = await parse({ github: { options: { id: { default: 5 } } } }, { github: { id: 10 }});
    expect(github2).toEqual({ github: { id: 10 } });
  });
});



describe('Parses the .env correctly', () => {
  it('works with pseudo-json', () => {
    expect(env.TEST44).toBe('{"a"}');
  });
});
