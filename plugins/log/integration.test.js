const server = require('../../server');
const { status } = server.reply;
const test = require('server/test');

describe('log()', () => {
  it('is defined', () => {
    server(parseInt(1000 + Math.random() * 10000)).then(ctx => {
      expect(ctx.log).toBeDefined();
      ctx.close();
    });
  });

  it('is inside the middleware', async () => {
    const res = await test(ctx => status(ctx.log ? 200 : 500)).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('has the right methods', async () => {
    const res = await test(ctx => {
      expect(ctx.log.emergency).toBeDefined();
      expect(ctx.log.alert).toBeDefined();
      expect(ctx.log.critical).toBeDefined();
      expect(ctx.log.error).toBeDefined();
      expect(ctx.log.warning).toBeDefined();
      expect(ctx.log.notice).toBeDefined();
      expect(ctx.log.info).toBeDefined();
      expect(ctx.log.debug).toBeDefined();
      return status(200);
    }).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('rejects invalid log levels', async () => {
    const res = test({ log: 'abc' }).get('/');

    // Now errors must be fully qualified with Jest
    await expect(res).rejects.toMatchObject({ code: '/server/options/enum' });
  });

  it('uses the given instance, if any', async () => {
    const instance = {
      emergency() {}, alert() {}, critical() {}, error() {}, warning() {},
      notice() {}, info() {}, debug() {}
    };
    const res = await test(
      { log: { instance } },
      ctx => status(ctx.log === instance ? 200 : 500)
    ).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('rejects instance with missing methods', async () => {
    const missingMany = test({ log: { instance: {} } }).get('/');
    await expect(missingMany).rejects.toThrow(
      'Missing log.instance methods: emergency, alert, critical, error, warning, notice, info, debug'
    );

    const instance = {
      emergency() {}, alert() {}, critical() {}, error() {}, warning() {},
      notice() {}, info() {}, /* missing debug() */
    };
    const missingOne = test({ log: { instance } }).get('/');
    await expect(missingOne).rejects.toThrow('Missing log.instance method: debug');
  });
});
