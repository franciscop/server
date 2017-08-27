const run = require('server/test/run');
const stat = require('./');
const error = require('server/router/error');

describe('static plugin', () => {
  it('exists', async () => {
    await run().get('/');
    expect(stat).toBeDefined();
    expect(stat.name).toBe('static');
    expect(stat.options).toBeDefined();
  });

  it('static', async () => {
    console.log('Do I get logged?');
    const res = await run({ public: 'test' }, [
      async ctx => {
        console.log('From inside:', ctx.options.public);
        // const file = path.join(ctx.options.public, ctx.url);
        // console.log(file, ':', (await fs.readFile(file, 'utf8')).length);
      },
      error(ctx => { console.log(ctx.error); })
    ]).get('/logo.png');
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('image/png');
  });

  it('non-existing static', async () => {
    const res = await run({ public: 'test' }).get('/non-existing.png');
    expect(res.statusCode).toBe(404);
  });

});
