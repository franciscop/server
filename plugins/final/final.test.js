const test = require('server/test');

// Note: the `raw` option only works for tests

const storeLog = out => ({ report: { write: log => { out.log = log; } } });

describe('final', () => {
  it('gets called with an unhandled error', async () => {
    const simple = () => { throw new Error('Hello Error'); };
    const out = {};
    const res = await test({ raw: true, log: storeLog(out) }, simple).get('/');
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe('Hello Error');
    expect(out.log).toMatch('Hello Error');
  });

  it('just logs it if the headers were already sent', async () => {
    const simple = () => { throw new Error('Hello Error'); };
    const out = {};
    const res = await test({ raw: true, log: storeLog(out) }, () => 'Hello world', simple).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('Hello world');
    expect(out.log).toMatch('Hello Error');
  });

  it('displays the appropriate error to the public', async () => {
    const simple = () => {
      const err = new Error('Hello Error: display to the public');
      err.public = true;
      throw err;
    };
    const out = {};
    const res = await test({ raw: true, log: storeLog(out) }, simple).get('/');
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe('Hello Error: display to the public');
    expect(out.log).toMatch('Hello Error');
  });

  it('makes the status 500 if it is invalid', async () => {
    const simple = () => {
      const err = new Error('Hello Error');
      err.status = 'pepito';
      throw err;
    };
    const out = {};
    const res = await test({ raw: true, log: storeLog(out) }, simple).get('/');
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe('Hello Error');
    expect(out.log).toMatch('Hello Error');
  });

  it('does not reply if the headers are already sent', async () => {
    const simple = ctx => {
      ctx.res.send('Error 世界');
      throw new Error('Hello');
    };
    const out = {};
    const res = await test({ log: storeLog(out) }, simple).get('/');
    expect(res.body).toBe('Error 世界');
  });

  it('handles non-existing requests to a 404', async () => {
    const out = {};
    const res = await test({ log: storeLog(out) }).get('/non-existing');

    expect(res.statusCode).toBe(404);
    expect(out.log).toMatch(/did not return anything/);
  });
});
