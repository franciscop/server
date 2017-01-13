let server = require('../server');

describe('Options', () => {
  it('default settings are correct', done => {
    server().then(server => {
      expect(server.options.port).toBe(3000);
      expect(server.options['view engine']).toBe('pug');
      expect(server.options.public).toBe('public');
      expect(server.options.verbose).toBe(false);
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

  it('sets the view engine properly', done => {
    server({ 'view engine': 'whatever' }).then(server => {
      expect(server.app.get('view engine')).toBe('whatever');
      server.close();
      done();
    });
  });

  it('has independent instances', done => {
    server(2000).then(serv1 => {
      server(3000).then(serv2 => {
        expect(serv2.options.port).toBe(3000);
        serv2.options.port = 3500;
        expect(serv1.options.port).toBe(2000);
        expect(serv2.options.port).toBe(3500);

        serv2.a = 'abc';
        expect(typeof serv1.a).toBe('undefined');
        expect(serv2.a).toBe('abc');
        serv1.close();
        serv2.close();
        done();
      });
    });
  });
});
