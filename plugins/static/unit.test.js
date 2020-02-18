const run = require('server/test/run');
const stat = require('./');

const storeLog = out => ({ report: { write: log => { out.log = log; } } });

describe('static plugin', () => {
  it('exists', () => {
    expect(stat).toBeDefined();
    expect(stat.name).toBe('static');
    expect(stat.options).toBeDefined();
  });

  it('static', async () => {
    const res = await run({ public: 'test' }).get('/logo.png');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('image/png');
  });

  it('non-existing static', async () => {
    let out = {};
    const log = storeLog(out);
    const res = await run({ public: 'xxxx', log }).get('/non-existing.png');

    expect(res.statusCode).toBe(404);
    expect(out.log).toMatch(/did not return anything/);
  });

  it('does not serve if set to false', async () => {
    let out = {};
    const log = storeLog(out);
    const res = await run({ public: false, log }).get('/logo.png');

    expect(res.statusCode).toBe(404);
    expect(out.log).toMatch(/did not return anything/);
  });

  it('does not serve if set to empty string', async () => {
    let out = {};
    const log = storeLog(out);
    const res = await run({ public: '', log }).get('/logo.png');

    expect(res.statusCode).toBe(404);
    expect(out.log).toMatch(/did not return anything/);
  });
});
