const test = require('./run');
const port = require('./port');
const server = require('../server');

describe('run() main function', () => {
  it('is a function', async () => {
    let test = require('./run');
    expect(test instanceof Function).toBe(true);
  });

  it('can be called empty', async () => {
    return test();
  });

  it('can be called with middleware', async () => {
    const mid = ctx => 'Hello world 1';
    const res = await test(mid).get('/');
    expect(res.body).toBe('Hello world 1');
  });

  it('can be called with a server instance', async () => {
    const mid = ctx => 'Hello world 2';
    const res = await test(await server({ port: port() }, mid)).get('/');
    expect(res.body).toBe('Hello world 2');
  });

  it('can be called with a server promise', async () => {
    const mid = ctx => 'Hello world 3';
    const res = await test(server({ port: port() }, mid)).get('/');
    expect(res.body).toBe('Hello world 3');
  });

  it('can do alive', async () => {
    const mid = ctx => {
      ctx.session.counter = (ctx.session.counter || 0) + 1;
      return 'Hello world ' + ctx.session.counter;
    };
    return test(server({ port: port() }, mid)).run(async api => {
      const res = await api.get('/');
      expect(res.body).toBe('Hello world 1');
      const res2 = await api.get('/');
      expect(res2.body).toBe('Hello world 2');
    });
  });

  it('does not close it if comes from outside', async () => {
    const mid = ctx => 'Hello world';
    const app = await server({ port: port() }, mid);
    const res = await test(app).get('/');
    expect(res.body).toBe('Hello world');
    const res2 = await test(app).get('/');
    expect(res2.body).toBe('Hello world');
  });

});
