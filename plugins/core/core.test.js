// Internal files
const server = require('../../server');
const { get, post } = server.router;
const { send } = server.reply;
const { getter, handler, port } = require('server/test');
const persist = require('server/test/persist');

// Local helpers and data
const empty = () => 'Hello 世界';
const tests = 'test';
const favicon = tests + '/logo.png';


describe('Default modules', () => {

  it('compress?', async () => {
    const portN = port();
    const url = `http://localhost:${portN}/favicon.ico`;
    const res = await handler(empty, { url }, { port: portN, connect: { favicon } });
    expect(res.headers['content-encoding']).toBe('gzip');
  });

  it('favicon', async () => {
    const portN = port();
    const url = `http://localhost:${portN}/favicon.ico`;
    const res = await handler(empty, { url }, { port: portN, connect: { favicon } });
    expect(res.headers['content-type']).toBe('image/x-icon');
  });

  it('static', async () => {
    return persist(async test => {
      const res = await test.get('/logo.png');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('image/png');
    })(await server({ public: tests, port: port() }));
  });

  it('non-existing static', async () => {
    return persist(async test => {
      const res = await test.get('/non-existing.png');
      expect(res.statusCode).toBe(404);
    })(await server({ public: tests, port: port() }));
  });

  it('response-time', async () => {
    const res = await getter(empty);
    expect(typeof res.headers['x-response-time']).toBe('string');
  });

  it('can handle sessions', async () => {
    const ctx = await server({ public: tests, port: port() }, [
      get('/a', ctx => { ctx.req.session.page = 'pageA'; }, () => send('')),
      get('/b', ctx => ctx.req.session.page),
    ]);
    return persist(async test => {
      await test.get('/a').then(res => expect(res.body).toBe(''));
      await test.get('/b').then(res => expect(res.body).toBe('pageA'));
    })(ctx);
  });

  it('csurf', async () => {
    const ctx = await server({ public: tests, port: port() }, [
      get('/', ctx => ctx.res.locals.csrf),
      post('/', () => '世界')
    ]);
    return persist(async test => {
      let res = await test.get('/');
      expect(res.body).toBeDefined();
      res = await test.post('/', { _csrf: res.body });
      expect(res.statusCode).toBe(200);
    })(ctx);
  });

  // // SKIP: request() nor supertest() read gzip
  // it.skip('compress', async () => {
  //   const middle = ctx =>
  //     ctx.res.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
  //                  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
  //                  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
  //                  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  //
  //   const ctx = await launch(middle);
  //   const res = await supertest(ctx.server).get('/');
  //   // ...
  // });
});
