const run = require('server/test/run');

// Note: the `raw` option only works for tests

const storeLog = out => ({
  report: log => {
    out.log = log.toString();
  }
});

describe('final', () => {
  it('gets called with an unhandled error', async () => {
    const simple = () => {
      throw new Error('Hello Error');
    };
    const out = {};
    const res = await run({ raw: true, log: storeLog(out) }, simple).get('/');
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe('Internal Server Error');
    expect(out.log).toMatch('Hello Error');
  });

  it('is not called if the previous one finishes', async () => {
    let called = false;
    const simple = () => {
      called = true;
    };
    const out = {};
    const res = await run(
      { raw: true, log: storeLog(out) },
      () => 'Hello world',
      simple
    ).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('Hello world');
    expect(called).toBe(false);
  });

  it('displays the appropriate error to the public', async () => {
    const simple = () => {
      const err = new Error('Hello Error: display to the public');
      err.public = true;
      throw err;
    };
    const out = {};
    const res = await run({ raw: true, log: storeLog(out) }, simple).get('/');
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
    const res = await run({ raw: true, log: storeLog(out) }, simple).get('/');
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe('Internal Server Error');
    expect(out.log).toMatch('Hello Error');
  });

  it('does not reply if the headers are already sent', async () => {
    const simple = ctx => {
      ctx.res.send('Error 世界');
      throw new Error('Hello');
    };
    const res = await run(simple).get('/');
    expect(res.body).toBe('Error 世界');
  });

  it('handles non-existing requests to a 404', async () => {
    const out = {};
    const res = await run({ log: storeLog(out) }).get('/non-existing');

    expect(res.statusCode).toBe(404);
    expect(out.log).toMatch(/did not return anything/);
  });
});
