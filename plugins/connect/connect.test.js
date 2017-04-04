// External libraries used
const fs = require('fs');
const supertest = require('supertest');
const request = require('request-promises');

// Internal files
const server = require('../../server');
const { get, post, put, del, error } = server.router;
const { getter, poster, handler, req, cookies } = require('../../tests/helpers');

// Local helpers and data
const data = { hello: '世界' };
const logo = fs.createReadStream(__dirname + '/../../tests/logo.png');
const content = ctx => ctx.req.headers['content-type'];



describe('Default modules', () => {

  it('compress?', async () => {
    const middle = ctx => ctx.res.send();
    const url = 'http://localhost:3721/favicon.ico';
    const favicon = __dirname + '/../../tests/logo.png';
    const res = await handler(middle, { url }, { port: 3721, connect: { favicon } });
    expect(res.headers['content-encoding']).toBe('gzip');
  });

  it('favicon', async () => {
    const middle = ctx => ctx.res.send();
    const url = 'http://localhost:3721/favicon.ico';
    const favicon = __dirname + '/../../tests/logo.png';
    const res = await handler(middle, { url }, { port: 3721, connect: { favicon } });
    expect(res.headers['content-type']).toBe('image/x-icon');

    // This should not go here:
    // expect(res.headers['content-encoding']).toBe('gzip');
  });

  it('response-time', async () => {
    const middle = ctx => ctx.res.send('世界');
    const res = await getter(middle);
    expect(typeof res.headers['x-response-time']).toBe('string');
  });

  // GETTER doesn't have that signature
  it('serve-index', async () => {
    const path = __dirname + '/../../tests';
    const ctx = await launch([], { public: path });
    const logoUrl = 'http://localhost:' + ctx.options.port + '/logo.png';
    const res = await request(logoUrl);
    expect(res.headers['content-type']).toBe('image/png');
  });

  // Can handle sessions
  it('session', async () => {
    const setSession = ctx => { ctx.req.session.page = 'pageA' };
    const routes = [
      get('/a', setSession, ctx => ctx.res.end()),
      get('/b', ctx => ctx.res.send(ctx.req.session.page)),
    ];

    const ctx = await launch(routes);
    await req.get('/a', res => expect(res.text).toBe(''))(ctx);
    await req.get('/b', res => expect(res.text).toBe('pageA'))(ctx);
  });

  it('csurf', async () => {
    const routes = [
      get('/', ctx => ctx.res.send(ctx.res.locals.csrf)),
      post('/', ctx => ctx.res.send('世界'))
    ];

    const ctx = await launch(routes);
    const res = await supertest(ctx.server).get('/').expect(200);
    expect(res.text).toBeDefined();
    await supertest(ctx.server).post('/').set('Cookie', cookies(res))
      .send('_csrf=' + encodeURIComponent(res.text))
      .expect(200);
  });

  // SKIP: request() does not accept gzip
  it.skip('compress', async () => {
    const middle = ctx =>
      ctx.res.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    const ctx = await launch(middle);
    const res = await supertest(ctx.original).get('/');
    // ...
  });
});
