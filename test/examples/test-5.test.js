// Test automatically retrieved. Do not edit manually
const { render, json } = require('server/reply');
const { get, post } = require('server/router');
const { modern } = require('server').utils;
const run = require('server/test/run');

describe('Automatic test from content 5', () => {
  it('works', async () => {
    // START
    const options = {
      views: 'views'
    };
    
    /* test */
    const same = ctx => ({ views: ctx.options.views });
    const res = await run(options, same).get('/');
    expect(res.body.views).toBe(process.cwd() + '/views');
    // END
  });
});
      