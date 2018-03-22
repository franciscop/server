// About disabled eslint: Server uses polymorphism some times to detect
// express arguments or modern Promise-based functions, so we have to disable this
const server = require('../../server');
const { render, status } = server.reply;

// Test runner:
const test = require('server/test');

const views = process.cwd() + '/test/views/';

describe('express', () => {
  it('is defined', () => {
    server(parseInt(1000 + Math.random() * 10000)).then(ctx => {
      expect(ctx.app).toBeDefined();
      ctx.close();
    });
  });

  it('accepts the options', async () => {

    const options = {
      'case sensitive routing': true,
      'etag': 'strong',
      'jsonp callback name': 'abc',
      'subdomain offset': 1,
      'trust proxy': true,
      'view cache': true,
      'x-powered-by': false
    };

    const res = await test({ express: options }, ctx => {
      for (let key in options) {
        expect(ctx.app.get(key)).toBe(options[key]);
      }
      return status(200);
    }).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toBe('');
  });

  it('ignores the view engine (use .engine instead)', async () => {
    const res = await test({ express: { 'view engine': 'abc' } }, ctx => {
      expect(ctx.app.get('env')).toBe('test');
      expect(ctx.app.get('view engine')).toBe('pug');
      return status(200);
    }).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toBe('');
  });

  it('uses an old engine', async () => {
    const engine = {
      /* eslint-disable */
      bla: function (file, options, callback) {
      /* eslint-enable */
        callback(null, 'Hello world');
      }
    };
    const res = await test({ views, engine }, () => render('index.bla')).get('/');
    expect(res.body).toBe('Hello world');
    expect(res.status).toBe(200);
  });

  it('uses a modern engine', async () => {
    const engine = {
      /* eslint-disable */
      bla: (file, options) => 'Hello world 2'
      /* eslint-enable */
    };
    const res = await test({ views, engine }, () => render('index.bla')).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toBe('Hello world 2');
  });

  it('has a default locals', async () => {
    const res = await test(ctx => { ctx.locals.a = 5; }, ctx => ctx.locals).get('/');
    expect(res.body).toMatchObject({ a: 5 });
    expect(res.status).toBe(200);
  });

  it('the root locals works with views', async () => {
    const res = await test({ views: 'test/views' }, ctx => {
      ctx.locals.world = 'you';
    }, ctx => render('variable.hbs')).get('/');
    expect(res.body).toMatch(/<h1>Hello you<\/h1>/);
    expect(res.status).toBe(200);
  });

  it('no engine cannot render anything', async () => {
    const res = await test({ views, engine: false }, () => render('index.bla')).get('/');
    expect(res.status).toBe(500);
    expect(res.body).toMatch(/Cannot find module 'bla'/);
  });

  it('error in the render propagates', async () => {
    const engine = { bla: () => { throw new Error('blabla'); } };
    const res = await test({ views, engine }, () => render('index.bla')).get('/');
    expect(res.status).toBe(500);
    expect(res.body).toMatch(/blabla/);
  });

  it('requires the rendered file in the views folder', async () => {
    /* eslint-disable */
    const engine = { blo: (file, options) => 'Hello world' };
    /* eslint-enable */
    const res = await test({ views, engine }, () => render('index.blo')).get('/');
    expect(res.status).toBe(500);
    expect(res.body).toMatch(/Failed to lookup view "index.blo"/);
  });

  it('throws when closing it when already closed', async () => {
    const app = await server({ port: test.port() });
    await app.close();
    await expect(app.close()).rejects.toMatchObject({ message: 'Not running' });
  });
});
