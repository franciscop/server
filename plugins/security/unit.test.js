const run = require('server/test/run');
const { get, post } = require('server/router');

const returnCsrf = ctx => ctx.res.locals.csrf || 'none';

describe('static plugin', () => {
  it('receives csurf', async () => {
    const res = await run(returnCsrf).get('/');
    expect(res.body.length).toBe(36);
  });

  it('can deactivate csurf', async () => {
    const res = await run({ security: false }, returnCsrf).get('/');
    expect(res.body).toBe('none');
  });

  it('can deactivate csurf', async () => {
    const res = await run({ security: { csrf: false } }, returnCsrf).get('/');
    expect(res.body).toBe('none');
  });

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

  it('protects with frameguard', async () => {
    const res = await run(() => 'Hello world').get('/');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  it('can be deactivated', async () => {
    const res = await run({ security: false }, () => 'Hello world').get('/');
    expect(res.headers['x-frame-options']).toBe(undefined);
  });
});
