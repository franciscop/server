const schema = require('./schema');
const parse = require('./parse');

describe('schema', () => {
  it('uses the defaults', () => {
    expect(parse(schema)).toMatchObject({ port: 3000 });
    expect(parse(schema, {})).toMatchObject({ port: 3000 });
  });

  it('uses the __root', () => {
    expect(parse(schema, 2000)).toMatchObject({ port: 2000 });
  });

  it('can use a plain object', () => {
    expect(parse(schema, { port: 2000 })).toMatchObject({ port: 2000 });
  });

  it('can use a the ENV', () => {
    expect(parse(schema, { port: 2000 }, { PORT: 1000 })).toMatchObject({ port: 1000 });
  });

  it('can handle several types', () => {
    expect(parse(schema, { public: false })).toMatchObject({ public: false });
    expect(parse(schema, { public: 'abc' })).toMatchObject({ public: 'abc' });
  });

  it('rejects on incorrect types', async () => {
    const pub = new Promise(() => parse(schema, { public: 25 }));
    await expect(pub).rejects.toMatchObject({ code: '/server/options/type' });

    const port = new Promise(() => parse(schema, { port: '25' }));
    await expect(port).rejects.toMatchObject({ code: '/server/options/type' });
  });

  it('can handle NODE_ENV', () => {
    expect(parse(schema, {}, { NODE_ENV: 'development' })).toMatchObject({ env: 'development' });
    expect(parse(schema, {}, { NODE_ENV: 'testing' })).toMatchObject({ env: 'testing' });
    expect(parse(schema, {}, { NODE_ENV: 'production' })).toMatchObject({ env: 'production' });
  });

  it('throws with wrong enum', async () => {
    const env = new Promise(() => parse(schema, {}, { NODE_ENV: 'abc' }));
    await expect(env).rejects.toMatchObject({ code: '/server/options/enum' });
  });

  it('throws with `env` as a ref', async () => {
    const env = new Promise(() => parse(schema, { env: 'development' }));
    await expect(env).rejects.toMatchObject({ code: '/server/options/noarg' });
  });
});
