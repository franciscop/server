const parse = require('./parse');
const schema = require('./schema');
const path = require('path');


describe('options/parse', () => {
  it('uses the defaults', async () => {
    expect(await parse(schema)).toMatchObject({ port: 3000 });
    expect(await parse(schema, {})).toMatchObject({ port: 3000 });
  });

  it('uses the __root', async () => {
    expect(await parse(schema, {}, 2000)).toMatchObject({ port: 2000 });
  });

  it('can use a plain object', async () => {
    expect(await parse(schema, {}, { port: 2000 })).toMatchObject({ port: 2000 });
  });

  it('can use the argument', async () => {
    const opts = await parse({ public: { arg: true } }, {}, { public: 'abc' });
    expect(opts.public).toBe('abc');
  });

  it('can use the ENV', async () => {
    expect(await parse(schema, { PORT: 1000 }, { port: 2000 })).toMatchObject({ port: 1000 });
    expect(await parse({ port: { env: true } }, { PORT: 1000 }, { port: 2000 })).toMatchObject({ port: 1000 });
  });

  it('just works with false env and no env', async () => {
    const opts = await parse({ public: { env: false }}, {}, { public: 'abc' });
    expect(opts.public).toBe('abc');
  });

  it('accepts required with value', async () => {
    const opts = await parse({ public: { required: true } }, {}, { public: 'abc' });
    expect(opts.public).toBe('abc');
  });

  it('environment wins params', async () => {
    const opts = await parse(schema, { PUBLIC: 'abc' }, { public: 'aaa' });
    expect(opts.public).toMatch(/[/\\]abc/);
  });

  it('can handle several types', async () => {
    expect((await parse(schema, {}, { public: false })).public).toBe(false);
    expect((await parse(schema, {}, { public: 'abc' })).public).toMatch(/[/\\]abc/);
  });

  it('rejects on incorrect types', async () => {
    const pub = parse(schema, {}, { public: 25 });
    await expect(pub).rejects.toHaveProperty('code', '/server/options/type');

    const port = parse(schema, {}, { port: '25' });
    await expect(port).rejects.toHaveProperty('code', '/server/options/type');
  });

  it('can handle NODE_ENV', async () => {
    expect(await parse(schema, { NODE_ENV: 'development' })).toMatchObject({ env: 'development' });
    expect(await parse(schema, { NODE_ENV: 'test' })).toMatchObject({ env: 'test' });
    expect(await parse(schema, { NODE_ENV: 'production' })).toMatchObject({ env: 'production' });
  });

  it('throws with wrong value', async () => {
    const env = parse(schema, { NODE_ENV: 'abc' });
    await expect(env).rejects.toHaveProperty('code', '/server/options/enum');
  });
});


describe('public option', () => {
  beforeAll(function() {
    this.original = process.platform;
    Object.defineProperty(process, 'platform', { value: 'windows' });
  });
  afterAll(function(){
    Object.defineProperty(process, 'platform', { value: this.original });
  });

  it('cleans the public from the relative argument', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: { public: './public' },
      def: { default: '/another' }
    });
    expect(cleaned).toBe(process.cwd() + path.sep + 'public');
  });

  it('cleans the public from the absolute argument', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: { public: process.cwd() + path.sep + 'public' },
      def: { default: '/another' }
    });
    expect(cleaned).toBe(process.cwd() + path.sep + 'public');
  });

  it('cleans the public from the relative default', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: {},
      def: { default: './another' }
    });
    expect(cleaned).toBe(process.cwd() + path.sep + 'another');
  });

  it('cleans the public from the absolute default', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: {},
      def: { default: process.cwd() + path.sep + 'another' }
    });
    expect(cleaned).toBe(process.cwd() + path.sep + 'another');
  });
});
