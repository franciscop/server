// Test automatically retrieved. Do not edit manually
const { render, json } = require('server/reply');
const { get, post } = require('server/router');
const { modern } = require('server').utils;
const test = require('server/test');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 7', () => {
  it('works', async () => {
    // START
    // Simple visit counter for the main page
    const counter = get('/', ctx => {
      ctx.session.views = (ctx.session.views || 0) + 1;
      return { views: ctx.session.views };
    });
    
    /* test */
    await test(counter).run(async api => {
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
      