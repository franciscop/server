const test = require('server/test');
const stat = require('./');

const storeLog = out => ({ report: { write: log => { out.log = log; } } });

describe('static plugin', () => {
  it('exists', () => {
    expect(stat).toBeDefined();
    expect(stat.name).toBe('static');
    expect(stat.options).toBeDefined();
  });

  it('static', async () => {
    const res = await test({ public: 'test' }).get('/logo.png');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('image/png');
  });

  it('non-existing static', async () => {
    let out = {};
    const log = storeLog(out);
    const res = await test({ public: 'test', log }).get('/non-existing.png');

    expect(res.statusCode).toBe(404);
    expect(out.log).toMatch(/did not return anything/);
  });
});
