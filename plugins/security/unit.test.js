const test = require('server/test');
const { get, post } = require('server/router');

const returnCsrf = ctx => ctx.res.locals.csrf || 'none';

describe('static plugin', () => {
  it('receives csurf', async () => {
    const res = await test(returnCsrf).get('/');
    expect(res.body.length).toBe(36);
  });

  it('can deactivate csurf', async () => {
    const res = await test({ security: false }, returnCsrf).get('/');
    expect(res.body).toBe('none');
  });

  it('can deactivate csurf', async () => {
    const res = await test({ security: { csrf: false } }, returnCsrf).get('/');
    expect(res.body).toBe('none');
  });

  it('csurf', async () => {
    return await test({ public: 'test' }, [
      get('/', ctx => ctx.res.locals.csrf),
      post('/', () => '世界')
    ]).run(async api => {
      const csrf = (await api.get('/')).body;
      expect(csrf).toBeDefined();
      const res = await api.post('/', { body: { _csrf: csrf }});
      expect(res.statusCode).toBe(200);
    });
  });

  it('protects with frameguard', async () => {
    const res = await test(() => 'Hello world').get('/');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  it('can be deactivated', async () => {
    const res = await test({ security: false }, () => 'Hello world').get('/');
    expect(res.headers['x-frame-options']).toBe(undefined);
  });
});
