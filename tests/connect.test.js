let request = require('request-promise-native');
let fs = require('fs');
let server = require('../server');
let { get, post, put, del, error } = server.router;
let { getter, poster, handler } = require('./helpers');
let data = { hello: '世界' };
const supertest = require('supertest');

const content = type => ctx => {
  expect(ctx.req.headers['content-type']).toBe(type);
}

describe('Default modules', () => {

  // SKIP: request() does not accept gzip
  it.skip('compress', done => {
    let middle = ctx => {
      // 100 'a's
      const as = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
                 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      ctx.res.send(as);
    }

    getter(middle).then(res => {
      expect(res.caseless.dict['content-length'] < 90).toBe(true);
      done();
    });
  });

  it('session', done => {
    let middle = ctx => ctx.res.cookie('place', '世界').send();
    poster(middle, { place: '世界' }).then(res => {
      let cookieheader = res.headers['set-cookie'];
      expect(cookieheader.length).toBe(1);
      expect(cookieheader[0]).toBe('place=%E4%B8%96%E7%95%8C; Path=/');
      done();
    });
  });

  it('favicon', done => {
    let middle = ctx => ctx.res.send();
    handler(middle, {
      url: 'http://localhost:3721/favicon.ico'
    }, { port: 3721, middle: {
      favicon: __dirname + '/logo.png'
    } }).then(res => {
      expect(res.headers['content-type']).toBe('image/x-icon');
      expect(res.headers['content-encoding']).toBe('gzip');
      done();
    });
  });

  it('response-time', done => {
    let middle = ctx => ctx.res.send('世界');
    getter(middle).then(res => {
      expect(typeof res.headers['x-response-time']).toBe('string');
      done();
    });
  });

  it('csurf', done => {
    let routes = [
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

    // launch(routes, { secret: 'sdfsdfsdf' }).then(ctx => {
    //   let url = 'http://localhost:' + ctx.options.port + '/';
    //   var jar = request.jar();
    //   return request({ uri: url, resolveWithFullResponse: true, jar })
    //     .then(res => {
    //       console.log(jar.getCookieString(url));
    //       return request({ method: 'POST', uri: url, jar, headers: { 'X-CSRF-Token': res.body }, resolveWithFullResponse: true })
    //     })
    //     .then(res => console.log(jar.getCookieString(url)))
    //     .then(() => ctx.close())
    //     .catch(err => { ctx.close(); throw err; });
    // });
  });

  it.only('serve-index', () => {
    getter('/logo.png', {}, { public: 'tests' }).then(res => {
      console.log(res);
    });
    expect('a').toBe('a');
  });
});



function cookies (res) {
  return res.headers['set-cookie'].map(function (cookies) {
    return cookies.split(';')[0]
  }).join(';')
}
