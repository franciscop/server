const server = require('server');
const run = require('server/test/run');
const { get } = require('server/router');
const send = require('server/reply/send');

describe('session plugin', () => {
  it('can handle sessions', async () => {
    return run({ public: 'test' }, [
      get('/a', ctx => {
        ctx.session.page = 'pageA';
        return send('');
      }),
      get('/b', ctx => send(ctx.session.page))
    ]).alive(async api => {
      expect((await api.get('/a')).body).toEqual('');
      expect((await api.get('/b')).body).toEqual('pageA');
    });
  });

  it('persists the session', async () => {
    const mid = ctx => {
      ctx.session.counter = (ctx.session.counter || 0) + 1;
      return 'n' + ctx.session.counter;
    };
    return run(mid).alive(async api => {
      for (let i = 0; i < 3; i++) {
        const res = await api.get('/');
        expect(res.body).toBe('n' + (i + 1));
      }
    });
  });

  it('persists the session (again)', async () => {
    const mid = ctx => {
      ctx.session.counter = (ctx.session.counter || 0) + 1;
      return 'n' + ctx.session.counter;
    };
    return run(mid).alive(async api => {
      for (let i = 0; i < 3; i++) {
        const res = await api.get('/');
        expect(res.body).toBe('n' + (i + 1));
      }
    });
  });

  it('sends a session cookie', async () => {
    const res = await run(() => 'Hello world').get('/');
    expect(res.headers['set-cookie'][0]).toMatch(/connect.sid=/);
  });

  it('has the session for creating stores', () => {
    expect(server.session).toHaveProperty('Store', jasmine.any(Function));
  });
});
