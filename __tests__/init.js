let server = require('../server');

describe('Options', () => {
  it('can be initialized empty', done => {
    server().then((server) => {
      server.close();
      done();
    });
  });

  it('can be initialized with a single port parameter', done => {
    let port = 3000 + parseInt(Math.random() * 10000) % 1000;
    server(port).then(server => {
      expect(server.options.port).toBe(port);
      server.close();
      done();
    });
  });

  it('can be initialized with only a port', done => {
    let port = 3000 + parseInt(Math.random() * 10000) % 1000;
    server({ port: port }).then(server => {
      expect(server.options.port).toBe(port);
      server.close();
      done();
    });
  });

  it('can listen only one time to the same port', done => {
    server(3000).then(serve => {
      server(3000).catch(error => {
        expect(error.code === 'EADDRINUSE')
        done();
      });
      serve.close();
    });
  });

  it('default settings are correct', done => {
    server().then(server => {
      expect(server.options.port).toBe(3000);
      expect(server.options.viewengine).toBe('pug');
      expect(server.options.public).toBe('./public');
      server.close();
      done();
    });
  });

  it('sets the view engine properly', done => {
    server({ viewengine: 'whatever' }).then(server => {
      expect(server.app.get('view engine')).toBe('whatever');
      server.close();
      done();
    });
  });
});
