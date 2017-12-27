// Integration - test the router within the whole server functionality
const server = require('server');
const run = require('server/test/run');
const { get, post, put, del, sub, error } = server.router;



// Mock middlewares and data:
const question = { answer: 42 };
const mirror = ctx => ctx.data;
const hello = () => 'Hello 世界';
const throwError = () => { throw new Error('MockError'); };



// CSRF validation is checked in another place; disable it for these tests
run.options = { security: false };

describe('Basic router types', () => {
  it('can do a GET request', async () => {
    const mid = get('/', hello);

    const res = await run(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });

  it('can do a POST request', async () => {
    const mid = post('/', ctx => ctx.data);

    const res = await run(mid).post('/', { body: question });
    expect(res.body).toEqual({ answer: 42 });
    expect(res.status).toBe(200);
  });

  it('can do a PUT request', async () => {
    const mid = post('/', ctx => ctx.data);

    const res = await run(mid).post('/', { body: question });
    expect(res.body).toEqual({ answer: 42 });
    expect(res.status).toBe(200);
  });

  it('can do a DELETE request', async () => {
    const mid = del('/', ctx => 'Hello 世界');

    const res = await run(mid).del('/', { body: question });
    expect(res.body).toEqual('Hello 世界');
    expect(res.status).toBe(200);
  });
});


describe('Generic paths', () => {
  it('can do a GET request', async () => {
    const mid = get(hello);

    const res = await run(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });

  it('can do a GET request', async () => {
    const mid = get('*', hello);

    const res = await run(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });

  // it('can do a POST request', async () => {
  //   const mid = post('/', ctx => ctx.data);
  //
  //   const res = await run(mid).post('/', { body: question });
  //   expect(res.body).toEqual({ answer: 42 });
  //   expect(res.status).toBe(200);
  // });
  //
  // it('can do a PUT request', async () => {
  //   const mid = post('/', ctx => ctx.data);
  //
  //   const res = await run(mid).post('/', { body: question });
  //   expect(res.body).toEqual({ answer: 42 });
  //   expect(res.status).toBe(200);
  // });
  //
  // it('can do a DELETE request', async () => {
  //   const mid = del('/', ctx => 'Hello 世界');
  //
  //   const res = await run(mid).del('/', { body: question });
  //   expect(res.body).toEqual('Hello 世界');
  //   expect(res.status).toBe(200);
  // });
});


describe('Subdomain router', () => {
  it('can do a request to a subdomain', async () => {
    const mid = sub('api', get('/', hello));

    const res = await run((ctx) => {
      ctx.headers.host = 'api.example.com';
    }, mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });

  it('can handle regex', async () => {
    const mid = sub(/^api$/, get('/', hello));

    const res = await run((ctx) => {
      ctx.headers.host = 'api.example.com';
    }, mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });

  it('does not do partial match', async () => {
    const mid = sub(/^api$/, get('/', hello));

    const res = await run((ctx) => {
      ctx.headers.host = 'bla.api.example.com';
    }, mid, () => 'Did not match').get('/');
    expect(res).toMatchObject({ status: 200, body: 'Did not match' });
  });

  it('can do a request to a multi-level subdomain', async () => {
    const mid = sub('api.local', get('/', hello));

    const res = await run((ctx) => {
      ctx.headers.host = 'api.local.example.com';
    }, mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });
});


describe('Ends where it should end', () => {

  it('uses the matching method', async () => {
    const mid = [
      post('/', throwError),
      put('/', throwError),
      del('/', throwError),
      get('/', hello)
    ];

    const res = await run(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });


  it('uses the matching path', async () => {
    const mid = [
      get('/bla', throwError),
      get('/:id', throwError),
      get('/', hello)
    ];

    const res = await run(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });


  it('uses a route only once', async () => {
    const mid = [
      get('/', hello),
      get('/', throwError)
    ];

    const res = await run(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });


  it('parses params correctly', async () => {
    const mid = get('/:id', ctx => ctx.params.id);

    const res = await run(mid).get('/42?ignored=true');
    expect(res.body).toBe('42');
  });

  // A bug shifted the router's middleware on each request so now we test for
  // multiple request to make sure the middleware remains the same
  it('does not modify the router', async () => {
    const inst = run(get('/', hello)).alive(async api => {
      for (let url of [0, 1, 2]) {
        const res = await api.get('/');
        expect(res.body).toBe('Hello 世界');
      }
    });
  });


  it('does error matching', async () => {
    let err;
    const res = await run(throwError, error(ctx => {
      err = ctx.error;
      return 'Hello world';
    })).get('/');
    expect(res.body).toBe('Hello world');
    expect(err.message).toMatch(/MockError/);
  });

  it('does empty error matching', async () => {
    let err;
    const res = await run(throwError).get('/');
    expect(res.status).toBe(500);
  });
});
