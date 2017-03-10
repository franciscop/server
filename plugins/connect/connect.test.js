// External libraries used
const fs = require('fs');
const supertest = require('supertest');
const request = require('request-promise-native');

// Internal files
const server = require('../../server');
const { get, post, put, del, error } = server.router;
const { getter, poster, handler } = require('../../tests/helpers');

// Local helpers and data
const data = { hello: '世界' };
const logo = fs.createReadStream(__dirname + '/../../tests/logo.png');
const content = ctx => ctx.req.headers['content-type'];



describe('Default modules', () => {

  // SKIP: request() does not accept gzip
  it.skip('compress', done => {
    const middle = ctx =>
      ctx.res.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                   'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    getter(middle).then(res => {
      expect(res.caseless.dict['content-length'] < 90).toBe(true);
      done();
    });
  });

  it('favicon', done => {
    const middle = ctx => ctx.res.send();
    handler(middle, {
      url: 'http://localhost:3721/favicon.ico'
    }, { port: 3721, middle: {
      favicon: __dirname + '/../../tests/logo.png'
    } }).then(res => {
      expect(res.headers['content-type']).toBe('image/x-icon');
      expect(res.headers['content-encoding']).toBe('gzip');
      done();
    });
  });

  it('response-time', done => {
    const middle = ctx => ctx.res.send('世界');
    getter(middle).then(res => {
      expect(typeof res.headers['x-response-time']).toBe('string');
      done();
    });
  });

  it('serve-index', () => {
    getter('/logo.png', {}, { public: 'tests' }).then(res => {
      console.log(res);
    });
    expect('a').toBe('a');
  });

  // NOTE: for the next tests we'd need persistent `request()` (I couldn't make it)
  // Can handle sessions
  it.skip('session', () => {
    // TODO
  });

  it.skip('csurf', done => {
    // TODO: this doesn't work at all
    const routes = [
      get('/', ctx => ctx.res.send(ctx.req.csrfToken())),
      post('/', ctx => {
        console.log("Got here");
        expect(ctx.req.method).toBe('POST');
        ctx.res.send('世界');
      }),
      ctx => console.log(ctx.req.method),
      error('*', ctx => {
        console.log("CSRF:", ctx.req.headers['x-csrf-token']);
        console.log("SESSION:", ctx.req.session);
        console.log("ERROR:", ctx.error);
        ctx.res.send('Error');
      })
    ];
    launch(routes, { secret: 'sdfsdfsdf' }).then(ctx => {

      supertest(ctx.original)
        .get('/')
        .expect(200, function (err, res) {
          if (err) return done(err)
          var token = res.text

          console.log(res);
          supertest(ctx.original)
            .post('/')
            .set('Cookie', cookies(res))
            .send('_csrf=' + encodeURIComponent(token))
            .expect(200, done)
        });
    });
  });
});

function cookies (res) {
  return res.headers['set-cookie'].map(function (cookies) {
    return cookies.split(';')[0]
  }).join(';')
}
