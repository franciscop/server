// External libraries used
const fs = require('fs');

// Internal files
const server = require('../../server');
const { get, post, put, del, error } = server.router;
const { getter, poster, handler, port } = require('../../tests/helpers');
const persist = require('../../tests/helpers/persist');

// Local helpers and data
const empty = ctx => ctx.res.send();
const tests = __dirname + '/../../tests';
const favicon = tests + '/logo.png';
const content = ctx => ctx.req.headers['content-type'];


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
    const { getter, close } = await launch([], { public: tests }).then(persist);
    const res = await getter('/logo.png');
    expect(res.headers['content-type']).toBe('image/png');
    close();
  });

  it('response-time', async () => {
    const res = await getter(empty);
    expect(typeof res.headers['x-response-time']).toBe('string');
  });

  it('can handle sessions', async () => {
    const setSession = ctx => { ctx.req.session.page = 'pageA' };
    const routes = [
      get('/a', setSession, ctx => ctx.res.end()),
      get('/b', ctx => ctx.res.send(ctx.req.session.page)),
    ];

    const { getter, poster, close } = await launch(routes).then(persist);
    await getter('/a').then(res => expect(res.body).toBe(''));
    await getter('/b').then(res => expect(res.body).toBe('pageA'));
    close();
  });

  it('csurf', async () => {
    const routes = [
      get('/', ctx => ctx.res.send(ctx.res.locals.csrf)),
      post('/', ctx => ctx.res.send('世界'))
    ];

    const { getter, poster, close } = await launch(routes).then(persist);
    let res = await getter('/');
    expect(res.body).toBeDefined();
    res = await poster('/', { _csrf: res.body });
    expect(res.statusCode).toBe(200);
    close();
  });

  // SKIP: request() nor supertest() accept gzip
  it.skip('compress', async () => {
    const middle = ctx =>
      ctx.res.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    const ctx = await launch(middle);
    const res = await supertest(ctx.server).get('/');
    // ...
  });
});
