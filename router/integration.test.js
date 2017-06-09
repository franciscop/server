// Integration - test the router within the whole server functionality
const request = require('request-promises');
const server = require('server');
const { get, post, put, del } = server.router;
const { err, launch, handler } = require('server/test');
const hello = () => 'Hello 世界';

const routes = [
  get('/', hello),
  post('/', ctx => 'Hello ' + ctx.req.body.a),
];
const core = { csrf: false };

// Check that a response is performed and it's a simple one
const checker = ({ body = 'Hello 世界', method = 'GET' } = {}) => res => {
  expect(res.request.method).toBe(method);
  expect(res.body).toBe(body);
};

describe('Basic router types', () => {
  it('can do a GET request', () => {
    return handler(get('/', hello)).then(checker());
  });

  it('can do a POST request', () => {
    const method = 'POST';
    return handler(post('/', hello), { method }, { core }).then(checker({ method }));
  });

  it('can do a PUT request', () => {
    const method = 'PUT';
    return handler(put('/', hello), { method }, { core }).then(checker({ method }));
  });

  it('can do a DELETE request', () => {
    const method = 'DELETE';
    return handler(del('/', hello), { method }, { core }).then(checker({ method }));
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
    const middle = get('/:id', ctx => ctx.req.params.id);
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
    ctx.close();
  });
});
