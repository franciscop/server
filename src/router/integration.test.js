// Integration - test the router within the whole server functionality
const request = require('request-promises');
const server = require('../../server');
const { get, post, put, del } = server.router;
const { hello, err, launch, handler, getter, poster } = require('../../tests/helpers');
const command = require('promised-exec');
const routes = [
  get('/', ctx => ctx.res.send('Hello 世界')),
  post('/', ctx => ctx.res.send('Hello ' + ctx.req.body.a)),
];
const nocsrf = { connect: { csrf: false } };

// Check that a response is performed and it's a simple one
const checker = ({ body = 'Hello 世界', method = 'GET' } = {}) => res => {
  expect(res.request.method).toBe(method);
  expect(res.body).toBe(body);
}

describe('Basic router types', () => {
  it('can do a GET request', () => {
    return handler(get('/', hello)).then(checker());
  });

  it('can do a POST request', () => {
    const method = 'POST';
    return handler(post('/', hello), { method }, nocsrf).then(checker({ method }));
  });

  it('can do a PUT request', () => {
    const method = 'PUT';
    return handler(put('/', hello), { method }, nocsrf).then(checker({ method }));
  });

  it('can do a DELETE request', () => {
    const method = 'DELETE';
    return handler(del('/', hello), { method }, nocsrf).then(checker({ method }));
  });
});


describe('Ends where it should end', () => {
  it('uses the matching method', () => {
    return handler([
      post('/', err),
      put('/', err),
      del('/', err),
      get('/', hello)
    ]).then(checker());
  });

  it('uses the matching path', () => {
    return handler([
      get('/bla', err),
      get('/:id', err),
      get('/', hello)
    ]).then(checker());
  });

  it('uses a route only once', () => {
    return handler([
      get('/', hello),
      get('/', err)
    ]).then(checker());
  });

  it('parses params correctly', async () => {
    const middle = get('/:id', ctx => ctx.res.send(ctx.req.params.id));
    const res = await handler(middle, { path: '/42?ignored=true' });
    expect(res.body).toBe('42');
  });

  // A bug shifted the router's middleware on each request so now we test for
  // multiple request to make sure the middleware remains the same
  it('does not modify the router', async () => {
    const ctx = await launch([get('/w', ctx => ctx.res.send('w'))].concat(routes));
    const full = 'http://localhost:' + ctx.options.port + '/';
    for (let url of [full, full, full]) {
      const res = await request(url);
      expect(res.body).toBe('Hello 世界');
    }
  });
});
