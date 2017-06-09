// Internal files
const { handler, port } = require('server/test');

// Local helpers and data
const empty = () => 'Hello 世界';

describe('Basic router types', () => {
  it('has independent options', async () => {
    const portN = port();
    const url = `http://localhost:${portN}/favicon.ico`;
    const orig = handler([
      ctx => new Promise(resolve => {
        setTimeout(() => {
          ctx.res.send(ctx.options.public);
          resolve();
        }, 1000);
      })
    ], { url }, { public: 'right', port: portN });

    handler(empty, { url }, { public: 'wrong', port: port() });

    const res = await orig;
    expect(res.body).toMatch(/right/);
    expect(res.body).not.toMatch(/wrong/);
  });
});
