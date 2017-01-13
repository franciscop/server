let server = require('server');
let request = require('request');
let { get } = server.router;
let { handler, getter } = require('./helpers');


describe('Middleware', () => {
  it('loads as a function', done => {
    getter((req, res) => res.send('世界')).then(res => {
      expect(res.body).toBe('世界');
      done();
    });
  });

  it('loads as a relative file', done => {
    handler('./tests/a.js').then(res => {
      expect(res.body).toBe('世界');
      done();
    });
  });
});
