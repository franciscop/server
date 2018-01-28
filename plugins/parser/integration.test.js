// External libraries used
const { cookie } = require('server/reply');
const run = require('server/test/run');
const fs = require('fs');
run.options = { security: false };

// Local helpers and data
const logo = fs.createReadStream(__dirname + '/../../test/logo.png');
const content = ctx => ctx.headers['content-type'];


describe('Default modules', () => {

  it('bodyParser', async () => {
    const mid = ctx => {
      expect(ctx.data).toEqual(ctx.req.body);
      expect(ctx.data).toBeDefined();
      expect(ctx.data.hello).toBe('世界');
      expect(content(ctx)).toBe('application/x-www-form-urlencoded');
      return 'Hello 世界';
    };

    const res = await run(mid).post('/', { form: 'hello=世界' });
    expect(res.body).toBe('Hello 世界');
  });

  it('uses textParser', async () => {
    const mid = ctx => ctx.data;
    const headers = { 'Content-Type': 'text/plain' };
    const res = await run(mid).post('/', { headers, body: 'Hello 世界' });
    expect(res.body).toBe('Hello 世界');
  });

  it('can cancel textParser', async () => {
    const mid = ctx => ctx.data.length ? 'wrong' : 'right';
    const headers = { 'Content-Type': 'text/plain' };
    const options = { parser: { text: false } };
    const res = await run(options, mid).post('/', { headers, body: 'Hello 世界' });
    expect(res.body).toBe('right');
  });

  it('uses dataParser', async () => {
    const mid = ctx => ctx.files.logo;
    const res = await run(mid).post('/', { formData: { logo } });

    expect(res.body.name).toBe('logo.png');
    expect(res.body.type).toBe('image/png');
    expect(res.body.size).toBe(30587);
  });

  it('can cancel dataParser', async () => {
    const mid = ctx => ctx.data.length ? 'wrong' : 'right';
    const options = { parser: { data: false }};
    const res = await run(options, mid).post('/', { formData: { logo } });

    expect(res.body).toBe('right');
  });

  // It can *set* cookies from the server()
  // TODO: it can *get* cookies from the server()
  it('uses cookieParser', async () => {
    const mid = ctx => cookie('hello', ctx.cookies.place).send();
    const headers = { Cookie: 'place=%E4%B8%96%E7%95%8C' };
    const res = await run(mid).get('/', { headers });
    const cookies = res.headers['set-cookie'].join('\n');
    expect(cookies).toMatch('hello=%E4%B8%96%E7%95%8C');
  });

  it('can cancel cookieParser', async () => {
    const mid = ctx => cookie('hello', ctx.cookies.place).send();
    const headers = { Cookie: 'place=%E4%B8%96%E7%95%8C' };
    const options = { parser: { cookie: false } };
    const res = await run(options, mid).get('/', { headers });
    const cookies = (res.headers['set-cookie'] || []).join('\n');
    expect(cookies).not.toMatch('hello=%E4%B8%96%E7%95%8C');
  });

  // Change the method to the specified one
  it('method-override through header', async () => {
    const mid = ctx => {
      expect(ctx.method).toBe('PUT');
      expect(ctx.originalMethod).toBe('POST');
      return 'Hello 世界';
    };

    const headers = { 'X-HTTP-Method-Override': 'PUT' };
    const res = await run(mid).post('/', { headers });
    expect(res.body).toBe('Hello 世界');
  });

  // Change the method to the specified one
  it('cancel method-override', async () => {
    const mid = ctx => {
      expect(ctx.method).toBe('POST');
      expect(ctx.originalMethod).toBe(undefined);
      return 'Hello 世界';
    };

    const headers = { 'X-HTTP-Method-Override': 'PUT' };
    const res = await run({ parser: { method: false } }, mid).post('/', { headers });
    expect(res.body).toBe('Hello 世界');
  });

  // Change the method to the specified one
  it('override-method works with a string', async () => {
    const mid = ctx => {
      expect(ctx.method).toBe('PUT');
      expect(ctx.originalMethod).toBe('POST');
      return 'Hello 世界';
    };

    const headers = { 'X-HTTP-Method-Override': 'PUT' };
    const res = await run({ parser: {
      method: 'X-HTTP-Method-Override'
    } }, mid).post('/', { headers });
    expect(res.body).toBe('Hello 世界');
  });

  // Change the method to the specified one
  it('override-method works with an array', async () => {
    const mid = ctx => {
      expect(ctx.method).toBe('PUT');
      expect(ctx.originalMethod).toBe('POST');
      return 'Hello 世界';
    };

    const headers = { 'X-HTTP-Method-Override': 'PUT' };
    const res = await run({ parser: {
      method: ['X-HTTP-Method-Override']
    } }, mid).post('/', { headers });
    expect(res.body).toBe('Hello 世界');
  });

  // TODO: check more options
});



describe('Cancel parts through options', () => {

  it('can cancel bodyParser', async () => {
    const options = { parser: { body: false } };
    const mid = ctx => {
      expect(ctx.body).toEqual({});
      expect(ctx.headers['content-type']).toBe('application/x-www-form-urlencoded');
      return 'Hello 世界';
    };

    const res = await run(options, mid).post('/', { form: 'hello=世界' });
    expect(res.body).toBe('Hello 世界');
  });

  it('can cancel jsonParser', async () => {
    const mid = ctx => {
      expect(ctx.data).toEqual(ctx.req.body);
      expect(ctx.data).toEqual({});
      expect(content(ctx)).toBe('application/json');
      return 'Hello 世界';
    };

    const res = await run({ parser: { json: false }}, mid).post('/', { body: { hello: '世界' }});
    expect(res.body).toBe('Hello 世界');
  });

  // TODO: check all others can be cancelled
});
