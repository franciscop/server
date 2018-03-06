// Integration - test the router within the whole server functionality
const server = require('server');
const test = require('server/test');
const { get, post, put, del, sub, error } = server.router;



// Mock middlewares and data:
const question = { answer: 42 };
const hello = () => 'Hello 世界';
const throwError = () => {
  const err = new Error('MockError');
  err.code = 'test';
  throw err;
};



// CSRF validation is checked in another place; disable it for these tests
test.options = { security: false };

describe('Basic router types', () => {
  it('can do a GET request', async () => {
    const mid = get('/', hello);

    const res = await test(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });

  it('can do a POST request', async () => {
    const mid = post('/', ctx => ctx.data);

    const res = await test(mid).post('/', { body: question });
    expect(res.body).toEqual({ answer: 42 });
    expect(res.status).toBe(200);
  });

  it('can do a PUT request', async () => {
    const mid = post('/', ctx => ctx.data);

    const res = await test(mid).post('/', { body: question });
    expect(res.body).toEqual({ answer: 42 });
    expect(res.status).toBe(200);
  });

  it('can do a DELETE request', async () => {
    const mid = del('/', () => 'Hello 世界');

    const res = await test(mid).del('/', { body: question });
    expect(res.body).toEqual('Hello 世界');
    expect(res.status).toBe(200);
  });
});


describe('Generic paths', () => {
  it('can do a GET request', async () => {
    const mid = get(hello);

    const res = await test(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });

  it('can do a GET request', async () => {
    const mid = get('*', hello);

    const res = await test(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });

  // it('can do a POST request', async () => {
  //   const mid = post('/', ctx => ctx.data);
  //
  //   const res = await test(mid).post('/', { body: question });
  //   expect(res.body).toEqual({ answer: 42 });
  //   expect(res.status).toBe(200);
  // });
  //
  // it('can do a PUT request', async () => {
  //   const mid = post('/', ctx => ctx.data);
  //
  //   const res = await test(mid).post('/', { body: question });
  //   expect(res.body).toEqual({ answer: 42 });
  //   expect(res.status).toBe(200);
  // });
  //
  // it('can do a DELETE request', async () => {
  //   const mid = del('/', ctx => 'Hello 世界');
  //
  //   const res = await test(mid).del('/', { body: question });
  //   expect(res.body).toEqual('Hello 世界');
  //   expect(res.status).toBe(200);
  // });
});


describe('Subdomain router', () => {
  it('can do a request to a subdomain', async () => {
    const mid = sub('api', get('/', hello));

    const res = await test((ctx) => {
      ctx.headers.host = 'api.example.com';
    }, mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });

  it('can handle regex', async () => {
    const mid = sub(/^api$/, get('/', hello));

    const res = await test((ctx) => {
      ctx.headers.host = 'api.example.com';
    }, mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });

  it('does not do partial match', async () => {
    const mid = sub(/^api$/, get('/', hello));

    const res = await test((ctx) => {
      ctx.headers.host = 'bla.api.example.com';
    }, mid, () => 'Did not match').get('/');
    expect(res).toMatchObject({ status: 200, body: 'Did not match' });
  });

  it('can do a request to a multi-level subdomain', async () => {
    const mid = sub('api.local', get('/', hello));

    const res = await test((ctx) => {
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

    const res = await test(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });


  it('uses the matching path', async () => {
    const mid = [
      get('/bla', throwError),
      get('/:id', throwError),
      get('/', hello)
    ];

    const res = await test(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });


  it('uses a route only once', async () => {
    const mid = [
      get('/', hello),
      get('/', throwError)
    ];

    const res = await test(mid).get('/');
    expect(res).toMatchObject({ status: 200, body: 'Hello 世界' });
  });


  it('parses params correctly', async () => {
    const mid = get('/:id', ctx => ctx.params.id);

    const res = await test(mid).get('/42?ignored=true');
    expect(res.body).toBe('42');
  });

  // A bug shifted the router's middleware on each request so now we test for
  // multiple request to make sure the middleware remains the same
  it('does not modify the router', async () => {
    return test(get('/', hello)).run(async api => {
      const res1 = await api.get('/');
      expect(res1.body).toBe('Hello 世界');
      const res2 = await api.get('/');
      expect(res2.body).toBe('Hello 世界');
      const res3 = await api.get('/');
      expect(res3.body).toBe('Hello 世界');
    });
  });


  it('does generic error matching', async () => {
    let err;
    const res = await test(throwError, error(ctx => {
      err = ctx.error;
      return 'Hello world';
    })).get('/');
    expect(res.body).toBe('Hello world');
    expect(err.message).toMatch(/MockError/);
  });

  it('does path error matching', async () => {
    let err;
    const res = await test(throwError, error('test', ctx => {
      err = ctx.error;
      return 'Hello world';
    })).get('/');
    expect(res.body).toBe('Hello world');
    expect(err.message).toMatch(/MockError/);
  });

  it('ignores wrong path', async () => {
    let err;
    const res = await test(throwError, error('/wrong/', () => {
      err = { message: 'Wrong error :(' };
      throw new Error('Wrong error :(');
    }), error('test', ctx => {
      if (!err) err = ctx.error;
      return 'Hello world';
    })).get('/');
    expect(res.body).toBe('Hello world');
    expect(err.message).toMatch(/MockError/);
  });

  it('does empty error matching', async () => {
    const res = await test(throwError).get('/');
    expect(res.status).toBe(500);
  });
});
