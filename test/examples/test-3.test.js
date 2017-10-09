// Test automatically retrieved. Do not edit manually
const { render, json } = require('server/reply');
const { get, post } = require('server/router');
const { modern } = require('server').utils;
const run = require('server/test/run');

describe('Automatic test from content 3', () => {
  it('works', async () => {
    // START
    // Simple visit counter for the main page
    const counter = get('/', ctx => {
      ctx.session.views = (ctx.session.views || 0) + 1;
      return { views: ctx.session.views };
    });
    
    /* test */
    await run(counter).alive(async api => {
      let res = await api.get('/');
      expect(res.body.views).toBe(1);
      res = await api.get('/');
      expect(res.body.views).toBe(2);
      res = await api.get('/');
      expect(res.body.views).toBe(3);
    });
    // END
  });
});
      