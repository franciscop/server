const normalize = require('./normalize');

describe('Normalize', () => {
  it('works empty', () => {
    expect(normalize()).toMatchObject({
      method: 'GET',
      url: 'http://localhost:3000/'
    });
  });

  it('works with a method', () => {
    expect(normalize('POST')).toMatchObject({
      method: 'POST',
      url: 'http://localhost:3000/'
    });
  });

  it('works with a path', () => {
    expect(normalize('POST', '/test')).toMatchObject({
      method: 'POST',
      url: 'http://localhost:3000/test'
    });
  });

  it('works with a port', () => {
    expect(normalize('POST', '/test', 2000)).toMatchObject({
      method: 'POST',
      url: 'http://localhost:2000/test'
    });
  });

  it('works with a base url', () => {
    expect(normalize('POST', '/test', 2000, 'https://google.com/')).toMatchObject({
      method: 'POST',
      url: 'https://google.com/test'
    });
  });

  it('can set body as plain text', () => {
    expect(normalize('POST', '/', 3000, { body: 'hello world' })).toMatchObject({
      method: 'POST',
      url: 'http://localhost:3000/',
      body: 'hello world',
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  });

  it('can set body as json', () => {
    expect(normalize('POST', '/', 3000, { body: { hello: 'world' } })).toMatchObject({
      method: 'POST',
      url: 'http://localhost:3000/',
      json: true
    });
  });
});
