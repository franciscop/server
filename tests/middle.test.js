let server = require('server');
let request = require('request');
let { get } = server.router;
let { handler, getter } = require('./helpers');


describe('Middleware', () => {
  it('loads as a function', done => {
    getter(ctx => ctx.res.send('Hello 世界')).then(res => {
      expect(res.body).toBe('Hello 世界');
      done();
    });
  });

  it('has a valid context', () => {
    return getter(ctx => {
      ctx.res.send('Hello');
      expect(ctx.req).toBeDefined();
      expect(ctx.res).toBeDefined();
      expect(ctx.options).toBeDefined();
    });
  });

  it('loads as a relative file', done => {
    handler('./tests/a.js').then(res => {
      expect(res.body).toBe('世界');
      done();
    });
  });
});
