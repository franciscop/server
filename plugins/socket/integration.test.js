const server = require('../../');
const { socket, error } = server.router;


const io = require('socket.io-client');

const time = num => new Promise((resolve) => setTimeout(resolve, num));


const run = (...middle) => ({
  alive: async operation => {
    let inst;
    try {
      inst = await server({ port: 1000 + parseInt(Math.random() * 10000) }, ...middle);
      const client = io(`http://localhost:${inst.options.port}/`);
      await operation(client);
      await time(300);
      client.disconnect();
      await time(300);
    } catch (err) {
      console.log(err);
    } finally {
      await inst.close();
    }
  }
});


describe('socket()', () => {

  it('can listen to a simple call', async () => {
    let called = [];
    const middle = socket('message', () => { called.push('message'); });
    await run(middle).alive(api => {
      api.emit('message', { hello: 'world' });
    });
    expect(called).toEqual(['message']);
  });

  it('listens to simple messages', async () => {
    let called = [];
    const middle = socket('message', ctx => {
      called.push(ctx.data);
      return 'Hello';
    });
    await run(middle).alive(api => {
      api.emit('message', { hello: 'world' });
      api.on('message', data => { called.push(data); });
    });
    expect(called).toEqual([{ hello: 'world' }, 'Hello']);
  });

  it('can handle errors', async () => {
    let err;
    const middle = [
      socket('*', () => {
        throw new Error('socketerror');
      }),
      error(ctx => {
        err = ctx.error;
      })
    ];
    await run(middle).alive(api => {
      api.emit('message', { hello: 'world' });
    });
    expect(err.message).toMatch(/socketerror/);
  });

  it('can use wildcards', async () => {
    const called = [];
    const middle = socket('*', ctx => { called.push(ctx.path); });
    await run(middle).alive(api => {
      api.emit('message', { hello: 'world' });
    });
    expect(called).toEqual(['connect', 'message', 'disconnect']);
  });

  it('can perform connection, message and disconnection', async () => {
    const called = [];
    const middle = [
      socket('connect', () => { called.push('connect'); }),
      socket('message', () => { called.push('message'); }),
      socket('disconnect', () => { called.push('disconnect'); })
    ];
    await run(middle).alive(api => {
      api.emit('message', { hello: 'world' });
    });
    expect(called).toEqual(['connect', 'message', 'disconnect']);
  });

  it('can have multiple middleware', async () => {
    let total = 0;
    const addOne = () => { total++; };
    const middle = socket('message', addOne, addOne, addOne);
    await run(middle).alive(api => {
      api.emit('message', { hello: 'world' });
    });
    expect(total).toBe(3);
  });

  it('can perform two messages', async () => {
    const called = [];
    const middle = [
      socket('connect', () => { called.push('connect'); }),
      socket('message', () => { called.push('message'); }),
      socket('disconnect', () => { called.push('disconnect'); })
    ];
    await run(middle).alive(api => {
      api.emit('message', { hello: 'world' });
      api.emit('message', { hello: 'world' });
    });
    expect(called).toEqual(['connect', 'message', 'message', 'disconnect']);
  });
});
