// Integration - test the router within the whole server functionality
const server = require('server');
const run = require('server/test/run');
const { get, post, put, del } = server.router;



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
});
