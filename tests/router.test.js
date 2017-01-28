let request = require('request');
let server = require('../server');
let { get, post, put, del } = server.router;

let routes = [
  get('/', (req, res) => res.send('Hello 世界')),
  post('/', (req, res) => res.send('Hello ' + req.body.a)),
];

describe('Full trip request', () => {
  it('can perform a simple get with built-in response', done => {
    let port = parseInt(1000 * Math.random()) + 3000;
    server(port, [
      get('/').send('Hello 世界')
    ]).then(server => {
      request('http://localhost:' + port +'/', (err, res, body) => {
        server.close();
        expect(body).toBe('Hello 世界');
        done();
      });
    });
  });


  it('can concatenate', done => {
    let port = parseInt(1000 * Math.random()) + 3000;
    server(port, [
      get('/').status(400).send('Hello 世界')
    ]).then(server => {
      request('http://localhost:' + port +'/', (err, res, body) => {
        server.close();
        expect(body).toBe('Hello 世界');
        done();
      });
    });
  });
});
