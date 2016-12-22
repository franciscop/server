let server = require('server');
let request = require('request');
let { get } = server.router;

describe('Middleware', () => {
  it('Handles middleware', done => {
    server({}, './tests/a.js').then(inst => {
      request('http://localhost:3000/', (err, res, body) => {
        expect(err).toBe(null);
        expect(body).toBe('Good');
        done();
        inst.close();
      });
    });
  });
});
