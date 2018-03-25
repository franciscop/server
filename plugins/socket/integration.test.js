const server = require('../../');
const { socket, error } = server.router;
const test = require('../../test');

const io = require('socket.io-client');

// For some reason we have to wait a bit until closing/exiting
const time = num => new Promise((resolve) => setTimeout(resolve, num));
const timeToClose = 1000;
const timeToExit = 500;

const until = async (total = 10000, cb) => {
  const step = 100;
  let counter = 0;
  while (!cb() && step * counter < total) {
    counter++;
    await new Promise((resolve) => setTimeout(resolve, step));
  }
};

describe('socket()', () => {

  it('will ignore different methods', async () => {
    let called = [];
    const middle = [
      socket('/message', () => { called.push('message'); }),
      () => 'hello'
    ];
    await test(middle).run(async api => {
      const client = io(`http://localhost:${api.ctx.options.port}/`);
      client.emit('/message', { hello: 'world' });
      await until(10000, () => called.length);
      const res = await api.get('/message');
      called.push(res.body);
      client.disconnect();
      await time(timeToExit);
    });
    expect(called).toEqual(['message', 'hello']);
  });

  it('can listen to a simple call', async () => {
    let called = [];
    const middle = socket('message', () => {
      called.push('message');
    });
    await test(middle).run(async api => {
      const client = io(`http://localhost:${api.ctx.options.port}/`);
      client.emit('message', { hello: 'world' });
      await until(10000, () => called.length);
      client.disconnect();
      await time(timeToExit);
    });
    expect(called).toEqual(['message']);
  });

  it('listens to simple messages', async () => {
    let called = [];
    const middle = socket('message', ctx => {
      called.push(ctx.data);
      return 'Hello';
    });
    await test(middle).run(async api => {
      const client = io(`http://localhost:${api.ctx.options.port}/`);
      client.emit('message', { hello: 'world' });
      client.on('message', data => { called.push(data); });
      await time(timeToClose);
      client.disconnect();
      await time(timeToExit);
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
    await test(middle).run(async api => {
      const client = io(`http://localhost:${api.ctx.options.port}/`);
      client.emit('message', { hello: 'world' });
      await time(timeToClose);
      client.disconnect();
      await time(timeToExit);
    });
    expect(err.message).toMatch(/socketerror/);
  });

  it('can use wildcards', async () => {
    const called = [];
    const middle = socket('*', ctx => { called.push(ctx.path); });
    await test(middle).run(async api => {
      const client = io(`http://localhost:${api.ctx.options.port}/`);
      client.emit('message', { hello: 'world' });
      await time(timeToClose);
      client.disconnect();
      await time(timeToExit);
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
    await test(middle).run(async api => {
      const client = io(`http://localhost:${api.ctx.options.port}/`);
      client.emit('message', { hello: 'world' });
      await time(timeToClose);
      client.disconnect();
      await time(timeToExit);
    });
    expect(called).toEqual(['connect', 'message', 'disconnect']);
  });

  it('can have multiple middleware', async () => {
    let total = 0;
    const addOne = () => { total++; };
    const middle = socket('message', addOne, addOne, addOne);
    await test(middle).run(async api => {
      const client = io(`http://localhost:${api.ctx.options.port}/`);
      client.emit('message', { hello: 'world' });
      await time(timeToClose);
      client.disconnect();
      await time(timeToExit);
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
    await test(middle).run(async api => {
      const client = io(`http://localhost:${api.ctx.options.port}/`);
      client.emit('message', { hello: 'world' });
      client.emit('message', { hello: 'world' });
      await time(timeToClose);
      client.disconnect();
      await time(timeToExit);
    });
    expect(called).toEqual(['connect', 'message', 'message', 'disconnect']);
  });
});
