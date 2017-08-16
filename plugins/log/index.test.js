const server = require('../../server');
const { handler } = require('../../test');

describe('log()', () => {
  it('is defined', () => {
    server(parseInt(1000 + Math.random() * 10000)).then(ctx => {
      expect(ctx.log).toBeDefined();
      ctx.close();
    });
  });

  it('is inside the middleware', () => {
    const middle = ctx => {
      expect(ctx.log).toBeDefined();
      return 'Hello 世界';
    };
    return handler(middle);
  });

  it('has the right methods', () => {
    const middle = ctx => {
      expect(ctx.log.emergency).toBeDefined();
      expect(ctx.log.alert).toBeDefined();
      expect(ctx.log.critical).toBeDefined();
      expect(ctx.log.error).toBeDefined();
      expect(ctx.log.warning).toBeDefined();
      expect(ctx.log.notice).toBeDefined();
      expect(ctx.log.info).toBeDefined();
      expect(ctx.log.debug).toBeDefined();
      return 'Hello 世界';
    };
    return handler(middle);
  });

  it('rejects invalid log levels', async () => {
    // console.log(expect(drinkOctopus).rejects);
    await expect(handler([], {}, { log: 'abc' })).rejects.toMatchObject({
      message: 'The log level abc is not valid. Valid names: emergency,alert,critical,error,warning,notice,info,debug'
    });
  });
});
