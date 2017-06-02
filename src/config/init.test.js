const server = require('server');
const { port } = require('server/test');

describe('Options', () => {
  it('default settings are correct', async () => {
    const ctx = await server();
    ctx.close();
    expect(ctx.options.port).toBe(3000);
    expect(ctx.options.engine).toBe('pug');
    expect(ctx.options.verbose).toBe(false);
    expect(ctx.options.secret).toMatch(/^secret-/);
  });

  it('accepts a single port Number', async () => {
    const options = port();
    const ctx = await server(options);
    ctx.close();
    expect(ctx.options.port).toBe(options);
  });

  it('accepts a simple Object with a port prop', async () => {
    const options = { port: port() };
    const ctx = await server(options);
    ctx.close();
    expect(ctx.options.port).toBe(options.port);
  });

  it('can listen only one time to the same port', async () => {
    const onePort = port();
    const ctx = await server(onePort);
    const err = await server(onePort).catch(err => err);
    ctx.close();
    expect(err.code === 'EADDRINUSE');
  });

  it('sets the engine properly `engine`', async () => {
    const ctx = await server({ engine: 'whatever', port: port() });
    ctx.close();
    expect(ctx.app.get('view engine')).toBe('whatever');
  });

  it('sets the engine properly `view engine`', async () => {
    const ctx = await server({ 'view engine': 'whatever', port: port() });
    ctx.close();
    expect(ctx.app.get('view engine')).toBe('whatever');
  });

  it('has independent instances', async () => {
    const portA = port();
    const portB = port();
    const serv1 = await server(portA);
    const serv2 = await server(portB);
    serv1.close();
    serv2.close();

    expect(serv2.options.port).toBe(portB);
    const portC = port();
    serv2.options.port = portC;
    expect(serv1.options.port).toBe(portA);
    expect(serv2.options.port).toBe(portC);

    serv2.a = 'abc';
    expect(typeof serv1.a).toBe('undefined');
    expect(serv2.a).toBe('abc');
  });

  // // NOT PART OF THE STABLE API
  // it('logs init string', async () => {
  //   const logs = [];
  //   const index = server.plugins.push({
  //     name: 'log', launch: ctx => { ctx.log = msg => logs.push(msg) }
  //   });
  //   const ctx = await server({ port: port(), verbose: true });
  //   ctx.close();
  //   delete server.plugins[index];
  //   expect(logs.filter(one => /started on/.test(one)).length).toBe(1);
  // });
});
