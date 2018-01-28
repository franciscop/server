const server = require('../../');
const { socket, error } = server.router;


const io = require('socket.io-client');

const time = num => new Promise((resolve) => setTimeout(resolve, num));

describe('socket()', () => {
  it('listens to simple messages', async () => {
    let hasMessage = false;
    let inst;
    let ret;
    try {
      inst = await server({ port: 35454 },
        socket('message', ctx => {
          hasMessage = ctx.data;
          return 'Hello';
        })
      );
      const client = io('http://localhost:35454/');
      client.emit('message', { hello: 'world' });
      client.on('message', data => {
        ret = data;
      });
      await time(300);
      client.disconnect();
      await time(300);
    } catch (err) {
      console.log(err);
    } finally {
      await inst.close();
    }
    expect(hasMessage).toEqual({ hello: 'world' });
    expect(ret).toEqual('Hello');
  });

  it('can handle errors', async () => {
    let err;
    let inst;
    try {
      inst = await server({ port: 35454 },
        socket('*', () => {
          throw new Error('socketerror');
        }),
        error(ctx => {
          err = ctx.error;
        })
      );
      const client = io('http://localhost:35454/');
      client.emit('message', { hello: 'world' });
      await time(300);
      client.disconnect();
      await time(300);
    } catch (err) {
      console.log(err);
    } finally {
      await inst.close();
    }
    expect(err.message).toMatch(/socketerror/);
  });

  it('can use wildcards', async () => {
    let messages = [];
    let inst;
    try {
      inst = await server({ port: 35454 },
        socket('*', ctx => {
          messages.push(ctx.path);
        })
      );
      const client = io('http://localhost:35454/');
      client.emit('message', { hello: 'world' });
      await time(300);
      client.disconnect();
      await time(300);
    } catch (err) {
      console.log(err);
    } finally {
      await inst.close();
    }
    expect(messages).toEqual(['connect', 'message', 'disconnect']);
  });

  it('can perform connection, message and disconnection', async () => {
    const positions = {

    };
    let inst;
    try {
      inst = await server({ port: 35455 },
        socket('connect', () => {
          if (!positions.message && !positions.disconnect) {
            positions.connect = (positions.connect || 0) + 1;
          }
        }),
        socket('message', () => {
          if (positions.connect && !positions.disconnect) {
            positions.message = (positions.message || 0) + 1;
          }
          // ctx.socket.disconnect();
        }),
        socket('disconnect', () => {
          if (positions.connect && positions.message) {
            positions.disconnect = (positions.disconnect || 0) + 1;
          }
        }),
      );
      const client = io('http://localhost:35455/');
      client.emit('message', { hello: 'world' });
      await time(300);
      client.disconnect();
      await time(300);
    } catch (err) {
      console.log(err);
    } finally {
      await inst.close();
    }
    expect('connect' + positions.connect).toBe('connect1');
    expect('message' + positions.message).toBe('message1');
    expect('disconnect' + positions.disconnect).toBe('disconnect1');
  });
});
