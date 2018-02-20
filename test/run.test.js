const run = require('./run');
const port = require('./port');
const server = require('../server');

describe('run() main function', () => {
  it('is a function', async () => {
    let run = require('./run');
    expect(run instanceof Function).toBe(true);
  });

  it('can be called empty', async () => {
    return run();
  });

  it('can be called with a server promise', async () => {
    const mid = ctx => 'Hello world 1';
    const res = await run(server({ port: port() }, mid)).get('/');
    expect(res.body).toBe('Hello world 1');
  });

  it('can be called with a server instance', async () => {
    const mid = ctx => 'Hello world 2';
    const ctx = await server({ port: port() }, mid);
    const res = await run(ctx).get('/');
    expect(res.body).toBe('Hello world 2');
  });
});
