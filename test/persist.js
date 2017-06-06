// Persist - make request in a persistent way

const supertest = require('supertest');

module.exports = ctx => ({
  getter: async (path) => {
    const res = await supertest(ctx.server)
      .get(path)
      .set('Cookie', ctx.prev || '');

    ctx.prev = res.headers['set-cookie'];
    res.body = res.text;
    return res;
  },
  poster: async (path = '/', data = {}) => {
    const res = await supertest(ctx.server)
      .post(path)
      .send(data)
      .set('Cookie', ctx.prev || '');

    ctx.prev = res.headers['set-cookie'];
    res.body = res.text;
    return res;
  },
  close: () => ctx.close()
});

















// The final method for using getter, poster, etc
// It needs to be full wrapped for using ctx.close()
// Full examples:
// Plain
//   server().then(super(async test => {
//     await test.get('/');
//   }));
//
// Highlight the server()
//   const ctx = await server();
//   return super(async test => {
//     await test.get('/');
//   })(ctx);
//
// Highlight the get()
//   return super(async test => {
//     await test.get('/');
//   })(await server());

// Persist - make request in a persistent way
module.exports = cb => {
  return async ctx => {
    try {
      const test = {};
      test.get = async (path) => {
        const res = await supertest(ctx.server)
          .get(path)
          .set('Cookie', ctx.prev || '');
        ctx.prev = res.headers['set-cookie'];
        res.body = res.text;
        return res;
      };
      test.post = async (path = '/', data = {}) => {
        const res = await supertest(ctx.server)
          .post(path)
          .send(data)
          .set('Cookie', ctx.prev || '');

        ctx.prev = res.headers['set-cookie'];
        res.body = res.text;
        return res;
      };
      test.put = () => {};
      test.del = () => {};
      test.socket = () => {};
      await cb(test);
    } finally {
      ctx.close();
    }
  };
};
