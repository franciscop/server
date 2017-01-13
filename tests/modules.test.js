let request = require('request');
let fs = require('fs');
let server = require('../server');
let { get, post, put, del } = server.router;
let { getter, poster, handler } = require('./helpers');
let data = { hello: '世界' };

describe('Default modules', () => {

  it('bodyParser', done => {
    let middle = (req, res) => {
      expect(req.body.hello).toBe('世界');
      expect(req.headers['content-type']).toBe('application/x-www-form-urlencoded');
      res.send();
    };
    poster(middle, data).then(res => done());
  });

  it('jsonParser', done => {
    let middle = (req, res) => {
      expect(req.body.place).toBe('世界');
      expect(req.headers['content-type']).toBe('application/json');
      res.send();
    };

    handler(middle, { body: { place: '世界' }, json: true }).then(res => done());
  });

  it('dataParser', done => {
    var formData = { logo: fs.createReadStream(__dirname + '/logo.png') };
    let middle = (req, res) => {
      expect(req.files.logo.name).toBe('logo.png');
      expect(req.files.logo.type).toBe('image/png');
      expect(req.files.logo.size).toBe(10151);
      res.send();
    }

    handler(middle, { method: 'POST', formData: formData }).then(res => done());
  });

  it('compress', done => {
    var formData = { logo: fs.createReadStream(__dirname + '/logo.png') };
    let middle = (req, res) => {
      // 100 'a's
      res.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    }

    getter(middle).then(res => {
      console.log(res);
      done();
    });
  });

  it('cookieParser', done => {
    let middle = (req, res) => res.cookie('place', '世界').send();
    poster(middle, { place: '世界' }).then(res => {
      let cookieheader = res.headers['set-cookie'];
      expect(cookieheader.length).toBe(1);
      expect(cookieheader[0]).toBe('place=%E4%B8%96%E7%95%8C; Path=/');
      done();
    });
  });
});
