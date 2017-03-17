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

  // SKIP: request() does not accept gzip
  it.skip('compress', done => {
    const middle = ctx =>
      ctx.res.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    launch(middle).then(ctx => {
      supertest(ctx.original).get('/').then(res => {
        done();
      });
      // expect(res.caseless.dict['content-length'] < 90).toBe(true);
      // done();
    });
  });

  it('compress?', () => {
    const middle = ctx => ctx.res.send();
    const url = 'http://localhost:3721/favicon.ico';
    const favicon = __dirname + '/../../tests/logo.png';
    return handler(middle, { url }, { port: 3721, connect: { favicon } })
      .then(res => expect(res.headers['content-encoding']).toBe('gzip'));
  });

  it('favicon', () => {
    const middle = ctx => ctx.res.send();
    const url = 'http://localhost:3721/favicon.ico';
    const favicon = __dirname + '/../../tests/logo.png';
    return handler(middle, { url }, { port: 3721, connect: { favicon } })
      .then(res => expect(res.headers['content-type']).toBe('image/x-icon'));

    // This should not go here:
    // expect(res.headers['content-encoding']).toBe('gzip');
  });

  it('response-time', () => {
    const middle = ctx => ctx.res.send('世界');
    return getter(middle).then(res => {
      expect(typeof res.headers['x-response-time']).toBe('string');
    });
  });

  // GETTER doesn't have that signature
  it('serve-index', done => {
    const path = __dirname + '/../../tests';
    return launch([], { public: path }).then(ctx => {
      const logoUrl = 'http://localhost:' + ctx.options.port + '/logo.png';
      request(logoUrl).then(res => {
        expect(res.headers['content-type']).toBe('image/png');
        done();
      });
    });
  });

  // NOTE: for the next tests we'd need persistent `request()` (I couldn't make it)
  // Can handle sessions
  it('session', done => {
    const routes = [
      get('/a', ctx => { ctx.req.session.page = 'pageA'; ctx.res.end(); }),
      get('/', ctx => ctx.res.send(ctx.req.session.page)),
    ];

    launch(routes).then(req.get('/a')).then(req.get('/', res => {
      expect(res.text).toBe('pageA');
      done();
    }));
  });

  it('csurf', done => {
    const routes = [
      get('/', ctx => ctx.res.send(ctx.res.locals.csrf)),
      post('/', ctx => ctx.res.send('世界'))
    ];

    launch(routes).then(ctx => {
      supertest(ctx.server).get('/').expect(200).then(res => {
        expect(res.text).toBeDefined();
        supertest(ctx.server).post('/').set('Cookie', cookies(res))
          .send('_csrf=' + encodeURIComponent(res.text))
          .expect(200).then(() => done());
      });
    });
  });
});
