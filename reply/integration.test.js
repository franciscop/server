const server = require('server');
const run = require('server/test/run');
const {
  cookie, download, end, file, header, json,
  jsonp, redirect, render, send, status, type
} = require('.');

const logo = process.cwd() + '/test/logo.png';

describe('reply', () => {
  describe('cookie', () => {
    it('sets the cookie with name, value', async () => {
      const mid = () => cookie('hello', 'world').end();
      const res = await run(mid).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['set-cookie'][0]).toMatch(/hello\=world/);
    });
  });


  describe('download', () => {
    it('can download a file with an absolute path', async () => {
      const mid = async () => download(logo, 'logo.png');
      const res = await run(mid).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-disposition']).toBe('attachment; filename="logo.png"');
      expect(res.headers['content-type']).toBe('image/png');
    });

    it('can download a file with a relative path', async () => {
      const mid = async () => download('test/logo.png', 'logo.png');
      const res = await run(mid).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('image/png');
    });

    it('needs a path', async () => {
      const mid = async () => download();
      const res = await run(mid).get('/');
      expect(res.status).toBe(500);
      expect(res.body).toMatch(/first argument/);
    });

    it('the file has to exist', async () => {
      const mid = async () => download('blabla.png', 'bla.png');
      const res = await run(mid).get('/');
      expect(res.status).toBe(500);
      expect(res.body).toMatch(/does not exist/);
    });

    it('needs a name', async () => {
      const mid = async () => download(logo);
      const res = await run(mid).get('/');
      expect(res.status).toBe(500);
      expect(res.body).toMatch(/second argument/);
    });

    it('needs nothing else', async () => {
      const mid = async () => download(logo, 'logo.png', 'should not be here');
      const res = await run(mid).get('/');
      expect(res.status).toBe(500);
      expect(res.body).toMatch(/two arguments/);
    });
  });





  describe('end', () => {
    it('can end a request', async () => {
      const mid = async () => end();
      const res = await run(mid).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toBe('');
    });
  });





  describe('file', () => {
    it('can download a file with an absolute path', async () => {
      const mid = async () => file(logo, 'logo.png');
      const res = await run(mid).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-disposition']).toBe(undefined);
      expect(res.headers['content-type']).toBe('image/png');
    });

    it('can download a file with a relative path', async () => {
      const mid = async () => file('test/logo.png', 'logo.png');
      const res = await run(mid).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('image/png');
    });

    it('needs a path', async () => {
      const mid = async () => file();
      const res = await run(mid).get('/');
      expect(res.status).toBe(500);
      expect(res.body).toMatch(/first argument/);
    });

    it('the file has to exist', async () => {
      const mid = async () => file('blabla.png', 'bla.png');
      const res = await run(mid).get('/');
      expect(res.status).toBe(500);
      expect(res.body).toMatch(/does not exist/);
    });

    it('needs nothing else', async () => {
      const mid = async () => file(logo, 'logo.png', 'should not be here');
      const res = await run(mid).get('/');
      expect(res.status).toBe(500);
      expect(res.body).toMatch(/two arguments/);
    });
  });





  describe('header', () => {
    it('can send some headers', async () => {
      const mid = async () => header('hello', 'world').end();
      const res = await run(mid).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['hello']).toBe('world');
    });
  });





  describe('json', () => {
    it('answers json', async () => {
      const mid = () => json([0, 1, 'a']);
      const res = await run(mid).get('/');
      expect(res.rawBody).toBe('[0,1,"a"]');
      expect(res.headers['content-type']).toMatch(/application\/json/);
    });
  });





  describe('jsonp', () => {
    it('answers jsonp', async () => {
      const mid = () => jsonp([0, 1, 'a']);
      const res = await run(mid).get('/?callback=callback');
      expect(res.body).toMatch('callback([0,1,"a"])');
      expect(res.headers['content-type']).toMatch('text/javascript');
    });
  });





  describe('redirect', () => {
    it('send the correct headers', async () => {
      const mid = (ctx) => ctx.url === '/'
        ? redirect('/login') : ctx.url === '/login' ? 'Redirected' : 'Error';
      const res = await run(mid).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toBe('Redirected');
    });
  });





  describe('render', () => {
    it('renders a demo file', async () => {
      const mid = (ctx) => render('index.hbs');
      const res = await run({ views: 'test/views' }, mid).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toMatch(/\<h1\>Hello world\<\/h1\>/);
    });

    it('requires to specify a file', async () => {
      const mid = (ctx) => render();
      const res = await run({ views: 'test/views' }, mid).get('/');
      expect(res.status).toBe(500);
    });

    it('does not expect many things', async () => {
      const mid = (ctx) => render('index.hbs', {}, 'should not be here');
      const res = await run({ views: 'test/views' }, mid).get('/');
      expect(res.status).toBe(500);
    });
  });




  describe('send', () => {
    it('simple send answer', async () => {
      const mid = () => send('Hello 世界');
      const res = await run(mid).get('/');
      expect(res.body).toBe('Hello 世界');
    });

    it('does not allow to send the full context', async () => {
      const mid = ctx => send(ctx);
      const res = await run(mid).get('/');
      expect(res.status).toBe(500);
      expect(res.body).toMatch(/send the context/);
    });
  });





  describe('status', () => {
    it('can change the status', async () => {
      const mid = (ctx) => status(505).end();
      const res = await run(mid).get('/');
      expect(res.status).toBe(505);
    });
  });





  describe('type', () => {
    it('can set the response type', async () => {
      const mid = (ctx) => type('png').send('Hello');
      const res = await run(mid).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('image/png; charset=utf-8');
    });
  });
});
