const server = require('../../');
const { socket, error } = server.router;
const test = require('../../test');

const io = require('socket.io-client');

// For some reason we have to wait a bit until closing/exiting
const time = num => new Promise((resolve) => setTimeout(resolve, num));
const timeToClose = 500;
const timeToExit = 200;

describe('socket()', () => {

  it('can listen to a simple call', async () => {
    let called = [];
    const middle = socket('message', () => {
      console.log('Route called');
      called.push('message');
    });
    await test(middle).run(async api => {
      const client = io(`http://localhost:${api.ctx.options.port}/`);
      console.log('Calling');
      client.emit('message', { hello: 'world' });
      console.log('Calling ended');
      await time(timeToClose * 5);
      console.log('Closing');
      client.disconnect();
      console.log('Closing ended');
      await time(timeToExit);
    });
    console.log('After', called);
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
