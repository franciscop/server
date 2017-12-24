const server = require('../../server');
const { status } = server.reply;

// Test runner:
const run = require('server/test/run');

describe('express', () => {
  it('is defined', () => {
    server(parseInt(1000 + Math.random() * 10000)).then(ctx => {
      expect(ctx.app).toBeDefined();
      ctx.close();
    });
  });

  it('accepts the options', async () => {

    const options = {
      'case sensitive routing': true,
      'etag': 'strong',
      'jsonp callback name': 'abc',
      'subdomain offset': 1,
      'trust proxy': true,
      'view cache': true,
      'x-powered-by': false
    };

    const res = await run({ express: options }, ctx => {
      for (let key in options) {
        expect(ctx.app.get(key)).toBe(options[key]);
      }
      return status(200);
    }).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toBe('');
  });

  it('ignores the view engine (use .engine instead)', async () => {
    const res = await run({ express: { 'view engine': 'abc' } }, ctx => {
      expect(ctx.app.get('env')).toBe('test');
      expect(ctx.app.get('view engine')).toBe('pug');
      return status(200);
    }).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toBe('');
  });

  it.skip('uses an engine', async () => {
    const res = run({
      express: { engine: {
        blabla: 'I do not know how to make an engine yet'
      }}
    }).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toBe('');
  });
});
