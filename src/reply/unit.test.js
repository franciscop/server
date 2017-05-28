let reply;

describe('reply', () => {
  afterEach(() => {
    reply.stack = [];
  });

  it('can be imported', () => {
    reply = require('.');
  });

  it('has all the methods', () => {
    expect(reply.cookie).toBeDefined();
    expect(reply.download).toBeDefined();
    expect(reply.end).toBeDefined();
    expect(reply.file).toBeDefined();
    expect(reply.header).toBeDefined();
    expect(reply.json).toBeDefined();
    expect(reply.jsonp).toBeDefined();
    expect(reply.redirect).toBeDefined();
    expect(reply.render).toBeDefined();
    expect(reply.send).toBeDefined();
    expect(reply.status).toBeDefined();
    expect(reply.type).toBeDefined();
  });

  it('adds a method to the stack', () => {
    expect(reply.stack.length).toEqual(0);
    reply.file('./index.js')
    expect(reply.stack.length).toEqual(1);
  });
});
