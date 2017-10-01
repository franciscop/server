const run = require('server/test/run');
const { get, post } = require('server/router');

describe('static plugin', () => {
  it('csurf', async () => {
    return await run({ public: 'test' }, [
      get('/', ctx => ctx.res.locals.csrf),
      post('/', () => '世界')
    ]).alive(async api => {
      const csrf = (await api.get('/')).body;
      expect(csrf).toBeDefined();
      const res = await api.post('/', { body: { _csrf: csrf }});
      expect(res.statusCode).toBe(200);
    });
  });
});
