let server = require('server');
let request = require('request');
let { get } = server.router;

let shoot = (middle, cb, opts = {}) => {
  server(opts, middle).then(inst => {
    request('http://localhost:3000/', (err, res, body) => {
      inst.close();
      expect(err).toBe(null);
      cb(err, res, body);
    });
  });
};

describe('Middleware', () => {
  it('loads as a function', done => {
    shoot((req, res) => res.send('Good'), (err, res, body) => {
      expect(body).toBe('Good');
      done();
    });
  });

  it('loads as a relative file', done => {
    shoot('./tests/a.js', (err, res, body) => {
      expect(body).toBe('Good');
      done();
    });
  });
});
