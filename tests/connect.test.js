let request = require('request');
let fs = require('fs');
let server = require('../server');
let { get, post, put, del } = server.router;
let { getter, poster, handler } = require('./helpers');
let data = { hello: '世界' };

describe('Default modules', () => {

  it('bodyParser', () => {
    let middle = ctx => {
      expect(ctx.req.body.hello).toBe('世界');
      expect(ctx.req.headers['content-type']).toBe('application/x-www-form-urlencoded');
      ctx.res.send();
    };
    return poster(middle, data);
  });

  it('jsonParser', done => {
    let middle = ctx => {
      expect(ctx.req.body.place).toBe('世界');
      expect(ctx.req.headers['content-type']).toBe('application/json');
      ctx.res.send();
    };

    handler(middle, { body: { place: '世界' }, json: true }).then(res => done());
  });

  it('dataParser', done => {

    let formData = { logo: fs.createReadStream(__dirname + '/logo.png') };
    let middle = ctx => {
      expect(ctx.req.files.logo.name).toBe('logo.png');
      expect(ctx.req.files.logo.type).toBe('image/png');
      expect(ctx.req.files.logo.size).toBe(10151);
      ctx.res.send();
    }

    handler(middle, { method: 'POST', formData: formData }).then(res => done());
  });

  // request() does not accept gzip
  it.skip('compress', done => {
    let middle = ctx => {
      // 100 'a's
      ctx.res.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    }

    getter(middle).then(res => {
      expect(res.caseless.dict['content-length'] < 90).toBe(true);
      done();
    });
  });

  it('cookieParser', done => {
    let middle = ctx => ctx.res.cookie('place', '世界').send();
    poster(middle, { place: '世界' }).then(res => {
      let cookieheader = res.headers['set-cookie'];
      expect(cookieheader.length).toBe(1);
      expect(cookieheader[0]).toBe('place=%E4%B8%96%E7%95%8C; Path=/');
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

  it('method-override', done => {
    let middle = ctx => {
      expect(ctx.req.method).toBe('PUT');
      expect(ctx.req.originalMethod).toBe('POST');
      ctx.res.send('世界');
    }
    handler(middle, { method: 'POST', headers: {
      'X-HTTP-Method-Override': 'PUT'
    } }).then(res => done());
  });
});
