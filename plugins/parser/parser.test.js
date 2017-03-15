// External libraries used
const fs = require('fs');

// Internal files
const server = require('../../server');
const { getter, poster, handler } = require('../../tests/helpers');

// Local helpers and data
const data = { hello: '世界' };
const logo = fs.createReadStream(__dirname + '/../../tests/logo.png');
const content = ctx => ctx.req.headers['content-type'];
const nocsrf = { connect: { csrf: false } };


describe('Default modules', () => {

  it('bodyParser', () => {
    const middle = ctx => {
      expect(ctx.req.body).toBeDefined();
      expect(ctx.req.body.hello).toBe('世界');
      expect(content(ctx)).toBe('application/x-www-form-urlencoded');
      ctx.res.send();
    };
    return poster(middle, data, nocsrf);
  });

  it('jsonParser', () => {
    const middle = ctx => {
      expect(ctx.req.body.place).toBe('世界');
      expect(content(ctx)).toBe('application/json');
      ctx.res.send();
    };

    return handler(middle, { body: { place: '世界' }, json: true });
  });

  it('dataParser', () => {
    const middle = ctx => {
      expect(ctx.req.files.logo.name).toBe('logo.png');
      expect(ctx.req.files.logo.type).toBe('image/png');
      expect(ctx.req.files.logo.size).toBe(10151);
      ctx.res.send();
    }
    return handler(middle, { method: 'POST', formData: { logo } }, nocsrf);
  });

  // It can *set* cookies from the server()
  // TODO: it can *get* cookies from the server()
  it('cookieParser', () => {
    const middle = ctx => ctx.res.cookie('place', '世界').send();
    return poster(middle, { place: '世界' }, nocsrf).then(res => {
      const cookieheader = res.headers['set-cookie'];
      // Should be 2 because of the session
      expect(cookieheader.join().includes('place=%E4%B8%96%E7%95%8C')).toBe(true);
      // expect(cookieheader.length).toBe(2);
      // expect(cookieheader[0]).toBe('place=%E4%B8%96%E7%95%8C; Path=/');
    });
  });

  // Change the method to the specified one
  it('method-override through header', () => {
    const middle = ctx => {
      expect(ctx.req.method).toBe('PUT');
      expect(ctx.req.originalMethod).toBe('POST');
      ctx.res.send('世界');
    }
    const headers = { 'X-HTTP-Method-Override': 'PUT' };
    return handler(middle, { method: 'POST', headers }, nocsrf);
  });

  // TODO: check more options
});



describe('Cancel parts through options', () => {

  it('can cancel bodyParser', () => {
    const middle = ctx => {
      expect(ctx.req.body).toEqual({});
      expect(ctx.req.headers['content-type']).toBe('application/x-www-form-urlencoded');
      ctx.res.send();
    };
    return poster(middle, data, { parser: { body: false }, connect: { csrf: false } });
  });

  // TODO: check all others can be cancelled

  // NOTE: this comes from the default behaviour now; migrate it
  it('can cancel all parsers', () => {
    const middle = ctx => {
      expect(ctx.req.body).toBe(undefined);
      ctx.res.send();
    };
    return poster(middle, data, { parser: false, connect: { csrf: false } });
  });
});
