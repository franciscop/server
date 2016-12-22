let request = require('request');
let server = require('../server');
let { get, post, put, del } = server.router;

let routes = [
  get('/', (req, res) => res.send('Hello 世界')),
  post('/', (req, res) => res.send('Hello ' + req.body.a)),
];

describe('Full trip request', () => {
  it('dummy', done => {
    done();
  });

  it('can perform a simple get', done => {
    server({}, routes).then(server => {
      request('http://localhost:3000/', (err, res, body) => {
        expect(body).toBe('Hello 世界');
        server.close();
        done();
      });
    });
  });

  it('can perform a simple post', done => {
    server({}, routes).then(server => {
      let data = { form: { a: '世界' } };
      request.post('http://localhost:3000/', data, (err, res, body) => {
        expect(body).toBe('Hello 世界');
        server.close();
        done();
      });
    });
  });
});
