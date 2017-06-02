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
