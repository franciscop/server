let request = require('request-promise-native');
let server = require('../server');
let { get, post, put, del } = server.router;
let { hello, err, launch, handler, getter, poster } = require('./helpers');
let command = require('promised-exec');

// Check that a response is performed and it's a simple one
const checker = ({ body = 'Hello 世界', method = 'GET' } = {}) => res => {
  if (method) expect(res.request.method).toBe(method);
  if (body) expect(res.body).toBe(body);
}

describe('Basic router types', () => {
  it('can do a GET request', () => {
    return handler(get('/', hello)).then(checker());
  });

  it('can do a POST request', () => {
    const method = 'POST';
    return handler(post('/', hello), { method }).then(checker({ method }));
  });

  it('can do a PUT request', () => {
    const method = 'PUT';
    return handler(put('/', hello), { method }).then(checker({ method }));
  });

  it('can do a DELETE request', () => {
    const method = 'DELETE';
    return handler(del('/', hello), { method }).then(checker({ method }));
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
});


describe('performance', () => {
  let performance = false;

  beforeAll(() => {
    return command('which ab').then(res => {
      if (res) {
        performance = true;
      } else {
        console.log("Install apache benchmark for performance testing.");
      }
    });
  });

  it.skip('makes at least 1000 req/second without middleware', () => {
    if (!performance) return Promise.resolve('Good');

    const runAB = ctx => {
      return command(`ab -r -n 2000 -c 100 http://localhost:${ctx.options.port}/`);
    }
    return launch(get('/', hello), { middle: false }).then(runAB).then(analysis => {
      let total = /Requests per second:\s+(\d+)/.exec(analysis);
      if (!total) throw new Error('Could not parse the solution:', analysis);
      let rps = parseInt(total[1]);
      // console.log("RPS:", rps);
      expect(rps).toBeGreaterThan(1000);
    });
  }, 10000);
});
