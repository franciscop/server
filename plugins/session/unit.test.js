const run = require('server/test/run');
const get = require('server/router/get');
const send = require('server/reply/send');

describe('static plugin', () => {
  it('can handle sessions', async () => {
    return run({ public: 'test' }, [
      get('/a', ctx => { ctx.session.page = 'pageA'; }, () => send('')),
      get('/b', ctx => ctx.session.page),
    ]).alive(async api => {
      expect((await api.get('/a')).body).toBe('');
      expect((await api.get('/b')).body).toBe('pageA');
    });
  });
});
